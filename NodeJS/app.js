const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();

app.set('view engine', 'ejs');

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/shop' }),
    cookie: { maxAge: 180 * 60 * 1000 }
}));

app.use((req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    next();
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/shop');

// Define the Product model
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  number: Number,
});

const Product = mongoose.model('Product', productSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.all('/', (req, res) => {
    res.redirect('/products');
    });

// Routes
app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.render('products', {products: products});
});

app.post('/products', async (req, res) => {
  const newProduct = new Product(req.body);
  const savedProduct = await newProduct.save();
  res.redirect('/products');
});

app.delete('/products/:id', async (req, res) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  res.send(deletedProduct);
});

app.get('/add-product', (req, res) => {
    res.render('add_product');
  });

app.get('/cart', async (req, res) => {
    const sessionCart = req.session.cart || [];
    const itemCounts = {};
    for (let id of sessionCart) {
        if (itemCounts[id]) {
            itemCounts[id]++;
        } else {
            itemCounts[id] = 1;
        }
    }

    const products = await Product.find({ _id: { $in: sessionCart } });
    for (let product of products) {
        product.count = itemCounts[product._id.toString()];
    }
    const errorMessage = req.query.error;
    res.render('cart', { products: products, errorMessage: errorMessage});
});

app.post('/cart', (req, res) => {
    req.session.cart.push(req.body);
    res.redirect('/cart');
});

app.post('/add-to-cart', (req, res) => {
    const productId = req.body.productId;
    if (!req.session.cart) {
      req.session.cart = [];
    }
    req.session.cart.push(productId);
    res.redirect('/products');
  });

app.post('/checkout', async (req, res) => {
    const sessionCart = req.session.cart;

    const products = await Product.find({ _id: { $in: sessionCart } });

    const sessionCartCounts = {};
    for (let id of sessionCart) {
        if (sessionCartCounts[id]) {
            sessionCartCounts[id]++;
        } else {
            sessionCartCounts[id] = 1;
        }
    }

    for (let product of products) {
        if (product.number < sessionCartCounts[product._id.toString()]) {
            const errorMessage = `Not enough quantity of ${product.name} available.`;
            return res.redirect(`/cart?error=${encodeURIComponent(errorMessage)}`);
        }
    }

    for (let product of products) {
        product.number -= sessionCartCounts[product._id.toString()];
        await product.save();
    }

    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }
        res.redirect('/products');
    });
});

app.post('/clear-cart', (req, res) => {
    req.session.cart = [];
    res.redirect('/cart');
});

app.post('/remove-from-cart', (req, res) => {
    const productId = req.body.productId;
    const sessionCart = req.session.cart;
    const index = sessionCart.indexOf(productId);
    if (index > -1) {
      sessionCart.splice(index, 1);
    }
    res.redirect('/cart');
  });

app.listen(3000, () => console.log('Server listening on port 3000'));
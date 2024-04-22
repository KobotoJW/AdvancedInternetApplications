// App.js
import React, { useState, useEffect } from 'react';
import booksData from './books.json';
import Book from './Book';
import BookForm from './BookForm';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setBooks(booksData);
  }, []);

  const addBook = (title, author, review, photo) => {
    const newBook = { id: Math.random(), title, author, review, photo };
    setBooks([...books, newBook]);
  };

  const removeBook = (id) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  const sortBooks = () => {
    setBooks([...books].sort((a, b) => b.review - a.review));
  };

  const updateReview = (id, newReview) => {
    setBooks(books.map((book) => book.id === id ? { ...book, review: newReview } : book));
  };

  const filteredBooks = books.filter((book) => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='container'>
      <h1>Book collection</h1>
      <button className='sort-button' onClick={sortBooks}>Sort Books by Review</button>
      <input 
        className='search-input'
        type="text" 
        placeholder="Search..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
      <BookForm addBook={addBook} />
      <div className='books-grid'>
        {filteredBooks.map((book) => (
          <Book key={book.id} book={book} removeBook={removeBook} updateReview={updateReview} />
        ))}
      </div>
    </div>
  );
}

export default App;
document.getElementById('add-button').addEventListener('click', function() {
    var table = document.getElementById('item-list');

    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

    cell1.innerHTML = '<input type="text" id="edit-name">';
    cell2.innerHTML = '<input type="number" id="edit-quantity">';
    cell3.innerHTML = '<button onclick="saveItem(this)">Save</button><button onclick="removeItem(this)">Remove</button>';

    updateRowColors();
});

function saveItem(btn) {
    var row = btn.parentNode.parentNode;
    var name = document.getElementById('edit-name').value;
    var quantity = document.getElementById('edit-quantity').value;

    row.cells[0].innerHTML = name;
    row.cells[1].innerHTML = quantity;
    row.cells[2].innerHTML = '<button onclick="editItem(this)">Edit</button><button onclick="removeItem(this)">Remove</button>';

    updateRowColors();
}

function editItem(btn) {
    var row = btn.parentNode.parentNode;
    var name = row.cells[0].innerText;
    var quantity = row.cells[1].innerText;

    row.cells[0].innerHTML = '<input type="text" id="edit-name" value="' + name + '">';
    row.cells[1].innerHTML = '<input type="number" id="edit-quantity" value="' + quantity + '">';
    row.cells[2].innerHTML = '<button onclick="saveItem(this)">Save</button><button onclick="removeItem(this)">Remove</button>';
}

function removeItem(btn) {
    var row = btn.parentNode.parentNode;
    row.remove();
    updateRowColors();
}

function updateRowColors() {
    var table = document.getElementById('item-list');
    for (var i = 1; i < table.rows.length; i++) {
        if (i % 2 === 0) {
            table.rows[i].classList.add('alternate');
        } else {
            table.rows[i].classList.remove('alternate');
        }
    }
}
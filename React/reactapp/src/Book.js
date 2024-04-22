// Book.js
import React, { useState } from 'react';
import './Book.css';

const Book = ({ book, updateReview, removeBook }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className='book-container'>
      <h2 className='book-title'>{book.title}</h2>
      <h3 className='book-author'>{book.author}</h3>
      Review:{isEditing ? (
        <input 
          className='review-input'
          type="number" 
          min="1" 
          max="5" 
          step="0.1"
          value={book.review} 
          onChange={(e) => updateReview(book.id, e.target.value)}
          onBlur={() => setIsEditing(false)}
        />
      ) : (
        <p className='book-review' onClick={() => setIsEditing(true)}>{book.review}</p>
      )}
      <img className='book-image' src={book.photo} alt={book.title} />
      <button className='remove-button' onClick={() => removeBook(book.id)}>Remove</button>
    </div>
  );
};

export default Book;
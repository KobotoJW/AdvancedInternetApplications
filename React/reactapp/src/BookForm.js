import React, { useState } from 'react';
import './BookForm.css';

const BookForm = ({ addBook }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <button className='form-button' onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? 'Hide Form' : 'Show Form'}
      </button>
      <form className={`book-form ${isExpanded ? 'show' : ''}`} onSubmit={(e) => {
        e.preventDefault();
        addBook(e.target.elements.title.value, e.target.elements.author.value, e.target.elements.review.value, e.target.elements.photo.value);
      }}>
        <input name="title" placeholder="Title" required />
        <input name="author" placeholder="Author" required />
        <input name="review" placeholder="Review" type="number" min="1" max="5" step="0.1" required />
        <input name="photo" placeholder="Photo URL" />
        <button type="submit">Add Book</button>
      </form>
    </>
  );
};

export default BookForm;
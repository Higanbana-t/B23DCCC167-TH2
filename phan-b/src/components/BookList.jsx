import BookCard from './BookCard';

function BookList({ books, favorites, onToggleFavorite, onDeleteBook }) {
  if (books.length === 0) {
    return <p className="empty-msg">Không có cuốn sách nào phù hợp.</p>;
  }

  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          isFavorite={favorites.includes(book.id)}
          onToggleFavorite={onToggleFavorite}
          onDeleteBook={onDeleteBook}
        />
      ))}
    </div>
  );
}

export default BookList;

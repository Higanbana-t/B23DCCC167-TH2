function BookCard({ book, isFavorite, onToggleFavorite, onDeleteBook }) {
  return (
    <article className="book-card">
      <h3 className="book-title">{book.title}</h3>
      <p className="book-author">Tác giả: {book.author}</p>
      <p className="book-genre">Thể loại: {book.genre}</p>
      <p className="book-year">Năm XB: {book.year}</p>

      <div className="card-actions">
        <button
          type="button"
          className={`btn-fav ${isFavorite ? 'active' : ''}`}
          onClick={() => onToggleFavorite(book.id)}
        >
          {isFavorite ? 'Đã thích' : 'Yêu thích'}
        </button>

        {onDeleteBook && (
          <button
            type="button"
            className="btn-delete"
            onClick={() => onDeleteBook(book.id)}
          >
            Xóa
          </button>
        )}
      </div>
    </article>
  );
}

export default BookCard;

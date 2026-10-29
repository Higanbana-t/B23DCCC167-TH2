function GenreFilter({ genres, selectedGenre, onSelectGenre }) {
  return (
    <div className="genre-filter">
      <span className="filter-label">Chọn thể loại:</span>
      <div className="filter-buttons">
        <button
          type="button"
          className={`btn-genre ${selectedGenre === 'all' ? 'active' : ''}`}
          onClick={() => onSelectGenre('all')}
        >
          Tất cả
        </button>
        {genres.map((genre) => (
          <button
            key={genre}
            type="button"
            className={`btn-genre ${selectedGenre === genre ? 'active' : ''}`}
            onClick={() => onSelectGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}

export default GenreFilter;

import { useState } from 'react';
import { initialBooks } from './data/books';
import Header from './components/Header';
import Section from './components/Section';
import GenreFilter from './components/GenreFilter';
import BookList from './components/BookList';
import Footer from './components/Footer';
import './App.css';

function App() {
  // State quản lý danh sách sách
  const [books, setBooks] = useState(initialBooks);

  // State quản lý danh sách ID sách yêu thích
  const [favorites, setFavorites] = useState([]);

  // State quản lý thể loại đang được lọc
  const [selectedGenre, setSelectedGenre] = useState('all');

  // State tìm kiếm theo tên sách
  const [searchTerm, setSearchTerm] = useState('');

  // State chế độ sáng / tối
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Form thêm sách mới
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newGenre, setNewGenre] = useState('');
  const [newYear, setNewYear] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Lấy danh sách thể loại duy nhất từ danh sách sách bằng Set
  const genres = Array.from(new Set(books.map((b) => b.genre)));

  // Hàm xử lý bật / tắt yêu thích
  const handleToggleFavorite = (bookId) => {
    setFavorites((prev) => {
      if (prev.includes(bookId)) {
        return prev.filter((id) => id !== bookId);
      } else {
        return [...prev, bookId];
      }
    });
  };

  // Hàm xử lý xóa sách có hỏi xác nhận
  const handleDeleteBook = (bookId) => {
    const bookToDelete = books.find((b) => b.id === bookId);
    const bookName = bookToDelete ? `"${bookToDelete.title}"` : 'cuốn sách này';

    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa ${bookName} không?`);
    if (confirmed) {
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
      // Nếu sách bị xóa đang trong danh sách yêu thích thì xóa luôn
      setFavorites((prev) => prev.filter((id) => id !== bookId));
    }
  };

  // Validate form thêm sách
  const validateForm = () => {
    const errors = {};
    const currentYear = new Date().getFullYear();

    if (!newTitle.trim()) {
      errors.title = 'Tên sách không được để trống.';
    } else if (newTitle.trim().length < 3) {
      errors.title = 'Tên sách phải từ 3 ký tự trở lên.';
    }

    if (!newAuthor.trim()) {
      errors.author = 'Tác giả là bắt buộc.';
    }

    if (!newGenre) {
      errors.genre = 'Vui lòng chọn thể loại.';
    }

    const numYear = Number(newYear);
    if (!newYear) {
      errors.year = 'Năm xuất bản không được để trống.';
    } else if (isNaN(numYear) || !Number.isInteger(numYear)) {
      errors.year = 'Năm xuất bản phải là số nguyên.';
    } else if (numYear < 1900 || numYear > currentYear) {
      errors.year = `Năm xuất bản phải từ 1900 đến ${currentYear}.`;
    }

    return errors;
  };

  // Xử lý gửi form thêm sách
  const handleAddBook = (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const newBook = {
      id: Date.now(),
      title: newTitle.trim(),
      author: newAuthor.trim(),
      genre: newGenre,
      year: Number(newYear),
    };

    // Thêm vào đầu danh sách
    setBooks((prev) => [newBook, ...prev]);

    // Reset form
    setNewTitle('');
    setNewAuthor('');
    setNewGenre('');
    setNewYear('');
    setFormErrors({});
    alert('Thêm sách mới thành công!');
  };

  // Lọc danh sách theo thể loại và từ khóa tìm kiếm
  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase().trim());
    const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Header cập nhật số lượng yêu thích */}
      <Header favoriteCount={favorites.length} />

      {/* Thanh nút công cụ phụ: Đổi chế độ sáng/tối */}
      <div className="top-bar">
        <button
          type="button"
          className="btn-theme"
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}
        </button>
      </div>

      <main className="main-content">
        {/* Section bộ lọc và tìm kiếm (dùng children) */}
        <Section title="Tìm kiếm & Lọc sách">
          <div className="search-box">
            <label htmlFor="search">Tìm theo tên:</label>
            <input
              id="search"
              type="text"
              placeholder="Nhập tên sách..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <GenreFilter
            genres={genres}
            selectedGenre={selectedGenre}
            onSelectGenre={setSelectedGenre}
          />

          <div className="status-bar">
            Đang hiển thị {filteredBooks.length} / {books.length} cuốn
          </div>
        </Section>

        {/* Section danh sách sách (dùng children) */}
        <Section title="Danh sách sách trong thư viện">
          <BookList
            books={filteredBooks}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onDeleteBook={handleDeleteBook}
          />
        </Section>

        {/* Section thêm sách mới (dùng children) */}
        <Section title="Thêm Sách Mới">
          <form className="form-add-book" onSubmit={handleAddBook} noValidate>
            <div className="form-group">
              <label>Tên sách (*):</label>
              <input
                type="text"
                placeholder="Ví dụ: Lập trình React"
                value={newTitle}
                onChange={(e) => {
                  setNewTitle(e.target.value);
                  if (formErrors.title) {
                    setFormErrors({ ...formErrors, title: '' });
                  }
                }}
              />
              {formErrors.title && <span className="error-text">{formErrors.title}</span>}
            </div>

            <div className="form-group">
              <label>Tác giả (*):</label>
              <input
                type="text"
                placeholder="Ví dụ: Nguyễn Văn B"
                value={newAuthor}
                onChange={(e) => {
                  setNewAuthor(e.target.value);
                  if (formErrors.author) {
                    setFormErrors({ ...formErrors, author: '' });
                  }
                }}
              />
              {formErrors.author && <span className="error-text">{formErrors.author}</span>}
            </div>

            <div className="form-group">
              <label>Thể loại (*):</label>
              <select
                value={newGenre}
                onChange={(e) => {
                  setNewGenre(e.target.value);
                  if (formErrors.genre) {
                    setFormErrors({ ...formErrors, genre: '' });
                  }
                }}
              >
                <option value="">-- Chọn thể loại --</option>
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              {formErrors.genre && <span className="error-text">{formErrors.genre}</span>}
            </div>

            <div className="form-group">
              <label>Năm xuất bản (*):</label>
              <input
                type="number"
                placeholder="1900 - nay"
                value={newYear}
                onChange={(e) => {
                  setNewYear(e.target.value);
                  if (formErrors.year) {
                    setFormErrors({ ...formErrors, year: '' });
                  }
                }}
              />
              {formErrors.year && <span className="error-text">{formErrors.year}</span>}
            </div>

            <button type="submit" className="btn-submit">
              Thêm sách
            </button>
          </form>
        </Section>
      </main>

      <Footer />
    </div>
  );
}

export default App;

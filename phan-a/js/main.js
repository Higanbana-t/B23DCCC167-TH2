import { fetchBooks } from './api.js';
import { getFavorites, toggleFavorite, isFavorite, getTheme, saveTheme } from './storage.js';
import { validateTitle, validateAuthor, validateGenre, validateYear } from './validate.js';

// Quản lý trạng thái ứng dụng
let books = [];
let searchTerm = '';
let selectedGenre = 'all';

// DOM Elements
const favCountEl = document.getElementById('favCount');
const themeToggleBtn = document.getElementById('themeToggle');
const searchInput = document.getElementById('searchInput');
const genreSelect = document.getElementById('genreSelect');
const statusBar = document.getElementById('statusBar');
const loadingEl = document.getElementById('loading');
const errorMsgEl = document.getElementById('errorMsg');
const bookGrid = document.getElementById('bookGrid');

// Form elements
const addBookForm = document.getElementById('addBookForm');
const titleInput = document.getElementById('titleInput');
const authorInput = document.getElementById('authorInput');
const genreInput = document.getElementById('genreInput');
const yearInput = document.getElementById('yearInput');

const titleError = document.getElementById('titleError');
const authorError = document.getElementById('authorError');
const genreError = document.getElementById('genreError');
const yearError = document.getElementById('yearError');

// 1. Cập nhật số sách yêu thích trên Header
function updateFavoriteCount() {
  const favorites = getFavorites();
  favCountEl.textContent = favorites.length;
}

// 2. Cập nhật danh sách thể loại động bằng Set
function updateGenreOptions() {
  // Dùng Set để lấy danh sách thể loại duy nhất từ mảng books
  const genres = new Set(books.map((b) => b.genre));

  // Cập nhật cho dropdown lọc
  genreSelect.innerHTML = '<option value="all">-- Tất cả thể loại --</option>';
  genres.forEach((genre) => {
    const opt = document.createElement('option');
    opt.value = genre;
    opt.textContent = genre;
    genreSelect.appendChild(opt);
  });
  genreSelect.value = selectedGenre;

  // Cập nhật cho dropdown trong form thêm sách
  genreInput.innerHTML = '<option value="">-- Chọn thể loại --</option>';
  genres.forEach((genre) => {
    const opt = document.createElement('option');
    opt.value = genre;
    opt.textContent = genre;
    genreInput.appendChild(opt);
  });
}

// 3. Tạo thẻ sách bằng createElement và textContent
function createBookCard(book) {
  const card = document.createElement('div');
  card.className = 'book-card';
  card.dataset.id = book.id;

  // Tiêu đề sách
  const titleEl = document.createElement('h3');
  titleEl.className = 'book-title';
  titleEl.textContent = book.title;

  // Tác giả
  const authorEl = document.createElement('p');
  authorEl.className = 'book-author';
  authorEl.textContent = `Tác giả: ${book.author}`;

  // Thể loại
  const genreEl = document.createElement('p');
  genreEl.className = 'book-genre';
  genreEl.textContent = `Thể loại: ${book.genre}`;

  // Năm xuất bản
  const yearEl = document.createElement('p');
  yearEl.className = 'book-year';
  yearEl.textContent = `Năm xuất bản: ${book.year}`;

  // Nhóm nút bấm
  const actionsEl = document.createElement('div');
  actionsEl.className = 'card-actions';

  // Nút Yêu thích
  const favBtn = document.createElement('button');
  favBtn.className = 'btn-fav';
  const favorited = isFavorite(book.id);
  favBtn.textContent = favorited ? 'Đã thích' : 'Yêu thích';
  if (favorited) {
    favBtn.classList.add('active');
  }

  // Nút Xóa
  const delBtn = document.createElement('button');
  delBtn.className = 'btn-delete';
  delBtn.textContent = 'Xóa';

  actionsEl.appendChild(favBtn);
  actionsEl.appendChild(delBtn);

  card.appendChild(titleEl);
  card.appendChild(authorEl);
  card.appendChild(genreEl);
  card.appendChild(yearEl);
  card.appendChild(actionsEl);

  return card;
}

// 4. Lọc và hiển thị danh sách sách
function renderBooks() {
  // Lọc kết hợp: tên sách và thể loại
  const filtered = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase().trim());
    const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  // Hiển thị dòng trạng thái: "Đang hiển thị x / y cuốn"
  statusBar.textContent = `Đang hiển thị ${filtered.length} / ${books.length} cuốn`;

  // Xóa nội dung cũ trong grid
  bookGrid.innerHTML = '';

  if (filtered.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'empty-msg';
    emptyMsg.textContent = 'Không tìm thấy cuốn sách nào phù hợp.';
    bookGrid.appendChild(emptyMsg);
    return;
  }

  // Thêm từng thẻ sách vào grid bằng createElement
  filtered.forEach((book) => {
    const card = createBookCard(book);
    bookGrid.appendChild(card);
  });
}

// 5. Tải danh sách sách từ API
async function loadBooks() {
  loadingEl.style.display = 'block';
  errorMsgEl.style.display = 'none';
  bookGrid.style.display = 'none';

  try {
    const data = await fetchBooks();
    books = data;
    loadingEl.style.display = 'none';
    bookGrid.style.display = 'grid';

    updateGenreOptions();
    updateFavoriteCount();
    renderBooks();
  } catch (error) {
    loadingEl.style.display = 'none';
    errorMsgEl.style.display = 'block';
    errorMsgEl.textContent = `Đã xảy ra lỗi khi tải dữ liệu: ${error.message}`;
  }
}

// 6. Xử lý Event Delegation trên container bookGrid (Nút Yêu thích và Xóa)
bookGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.book-card');
  if (!card) return;

  const bookId = Number(card.dataset.id);
  const target = e.target;

  // Nút Yêu thích
  if (target.classList.contains('btn-fav')) {
    toggleFavorite(bookId);
    updateFavoriteCount();
    renderBooks();
  }

  // Nút Xóa
  if (target.classList.contains('btn-delete')) {
    const targetBook = books.find((b) => b.id === bookId);
    const bookName = targetBook ? `"${targetBook.title}"` : 'cuốn sách này';

    const confirmed = confirm(`Bạn có chắc chắn muốn xóa ${bookName} không?`);
    if (confirmed) {
      // Xóa sách khỏi danh sách
      books = books.filter((b) => b.id !== bookId);

      // Cập nhật lại dropdown thể loại nếu thể loại đó không còn sách nào
      updateGenreOptions();
      renderBooks();
    }
  }
});

// 7. Xử lý tìm kiếm ngay khi gõ
searchInput.addEventListener('input', (e) => {
  searchTerm = e.target.value;
  renderBooks();
});

// 8. Xử lý lọc theo thể loại
genreSelect.addEventListener('change', (e) => {
  selectedGenre = e.target.value;
  renderBooks();
});

// 9. Validate Form khi gõ (input event)
titleInput.addEventListener('input', () => {
  titleError.textContent = validateTitle(titleInput.value);
});

authorInput.addEventListener('input', () => {
  authorError.textContent = validateAuthor(authorInput.value);
});

genreInput.addEventListener('change', () => {
  genreError.textContent = validateGenre(genreInput.value);
});

yearInput.addEventListener('input', () => {
  yearError.textContent = validateYear(yearInput.value);
});

// 10. Xử lý submit form thêm sách
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Kiểm tra toàn bộ lỗi khi gửi
  const errTitle = validateTitle(titleInput.value);
  const errAuthor = validateAuthor(authorInput.value);
  const errGenre = validateGenre(genreInput.value);
  const errYear = validateYear(yearInput.value);

  titleError.textContent = errTitle;
  authorError.textContent = errAuthor;
  genreError.textContent = errGenre;
  yearError.textContent = errYear;

  // Nếu có bất kỳ lỗi nào, dừng lại
  if (errTitle || errAuthor || errGenre || errYear) {
    return;
  }

  // Tạo đối tượng sách mới
  const newBook = {
    id: Date.now(), // Tạo ID duy nhất bằng timestamp
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    genre: genreInput.value.trim(),
    year: Number(yearInput.value.trim()),
  };

  // Thêm sách vào đầu danh sách
  books.unshift(newBook);

  // Cập nhật lại danh sách thể loại nếu có thể loại mới
  updateGenreOptions();

  // Reset form và xóa thông báo lỗi
  addBookForm.reset();
  titleError.textContent = '';
  authorError.textContent = '';
  genreError.textContent = '';
  yearError.textContent = '';

  // Render lại danh sách hiển thị
  renderBooks();
  alert('Thêm sách thành công!');
});

// 11. Chế độ sáng / tối
function initTheme() {
  const currentTheme = getTheme();
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggleBtn.textContent = 'Chế độ sáng';
  } else {
    document.body.classList.remove('dark-mode');
    themeToggleBtn.textContent = 'Chế độ tối';
  }
}

themeToggleBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');
  if (isDark) {
    themeToggleBtn.textContent = 'Chế độ sáng';
    saveTheme('dark');
  } else {
    themeToggleBtn.textContent = 'Chế độ tối';
    saveTheme('light');
  }
});

// Khởi chạy ứng dụng
initTheme();
loadBooks();

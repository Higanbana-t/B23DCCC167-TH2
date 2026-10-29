// Module quản lý lưu trữ LocalStorage

const FAVORITES_KEY = 'library_favorites';
const THEME_KEY = 'library_theme';

// Lấy danh sách ID các sách yêu thích
export function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Lỗi đọc localStorage:', e);
    return [];
  }
}

// Lưu danh sách ID sách yêu thích
export function saveFavorites(favIds) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favIds));
  } catch (e) {
    console.error('Lỗi ghi localStorage:', e);
  }
}

// Kiểm tra 1 cuốn sách có được thích hay không
export function isFavorite(bookId) {
  const favorites = getFavorites();
  return favorites.includes(bookId);
}

// Bật/tắt trạng thái yêu thích của 1 cuốn sách
export function toggleFavorite(bookId) {
  const favorites = getFavorites();
  const index = favorites.indexOf(bookId);

  if (index === -1) {
    favorites.push(bookId);
  } else {
    favorites.splice(index, 1);
  }

  saveFavorites(favorites);
  return favorites;
}

// Lấy trạng thái theme sáng/tối
export function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

// Lưu trạng thái theme
export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

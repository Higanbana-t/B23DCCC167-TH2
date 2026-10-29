// Module gọi API lấy danh sách sách
export async function fetchBooks() {
  try {
    // Gọi fetch đến file books.json
    const response = await fetch('./books.json');

    if (!response.ok) {
      throw new Error(`Lỗi kết nối máy chủ (${response.status})`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Không thể tải danh sách sách:', error);
    throw error;
  }
}

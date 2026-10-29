// Module kiểm tra (validate) form thêm sách

export function validateTitle(title) {
  const trimmed = title.trim();
  if (!trimmed) {
    return 'Tên sách không được để trống.';
  }
  if (trimmed.length < 3) {
    return 'Tên sách phải có ít nhất 3 ký tự.';
  }
  return '';
}

export function validateAuthor(author) {
  const trimmed = author.trim();
  if (!trimmed) {
    return 'Tác giả là bắt buộc.';
  }
  return '';
}

export function validateGenre(genre) {
  if (!genre || genre.trim() === '') {
    return 'Vui lòng chọn thể loại.';
  }
  return '';
}

export function validateYear(year) {
  const currentYear = new Date().getFullYear();
  if (!year && year !== 0) {
    return 'Năm xuất bản không được để trống.';
  }
  const numYear = Number(year);
  if (isNaN(numYear) || !Number.isInteger(numYear)) {
    return 'Năm xuất bản phải là số nguyên.';
  }
  if (numYear < 1900 || numYear > currentYear) {
    return `Năm xuất bản phải từ 1900 đến năm ${currentYear}.`;
  }
  return '';
}

# BÀI THỰC HÀNH TH-2: QUẢN LÝ THƯ VIỆN SÁCH

Dự án bài tập thực hành môn Lập trình Web được xây dựng theo yêu cầu với phong cách đơn giản, gọn gàng, trực quan và dễ hiểu cho người mới học.

---

## 1. Cấu trúc thư mục

```text
TH-2/
├── package.json               # Script quản lý chạy Vite cho toàn bộ dự án
├── README.md                  # Hướng dẫn chạy và bài so sánh Phần A vs Phần B
├── phan-a/                    # PHẦN A: JAVASCRIPT THUẦN (DOM, ES MODULES)
│   ├── index.html             # Giao diện HTML dùng các thẻ semantic
│   ├── style.css              # CSS cơ bản (Flexbox, Grid 3 cột / 1 cột mobile, Dark mode)
│   ├── books.json             # Dữ liệu 10 cuốn sách (4 thể loại: CNTT, Văn học, Khoa học, Lịch sử)
│   └── js/
│       ├── api.js             # Module gọi API fetch + async/await đọc books.json
│       ├── storage.js         # Module quản lý LocalStorage (sách yêu thích, theme)
│       ├── validate.js        # Module kiểm tra dữ liệu form thêm sách
│       └── main.js            # Module điều phối DOM, Event Delegation, tìm kiếm, lọc
└── phan-b/                    # PHẦN B: REACT CƠ BẢN VỚI VITE
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── data/
        │   └── books.js       # Dữ liệu sách mẫu ban đầu
        ├── components/
        │   ├── Header.jsx      # Header hiển thị tên và số sách yêu thích
        │   ├── Section.jsx     # Wrapper component sử dụng props children
        │   ├── GenreFilter.jsx # Lọc thể loại bằng danh sách các nút bấm
        │   ├── BookList.jsx    # Lưới danh sách sách có key
        │   ├── BookCard.jsx    # Thẻ sách hiển thị thông tin và nút yêu thích / xóa
        │   └── Footer.jsx      # Chân trang
        ├── App.jsx            # Component gốc giữ state (favorites, genre, books)
        ├── App.css            # CSS đơn giản, responsive và Dark mode
        └── main.jsx
```

---

## 2. Hướng dẫn cài đặt và khởi chạy

Yêu cầu môi trường: Đã cài đặt **Node.js** (khuyến nghị phiên bản 18 trở lên).

### Bước 1: Cài đặt thư viện cho dự án React
Mở terminal tại thư mục `phan-b` và chạy:
```bash
cd phan-b
npm install --legacy-peer-deps
```

### Bước 2: Chạy ứng dụng

- **Để chạy Phần B (React Vite):**
  ```bash
  cd phan-b
  npm run dev
  ```
  Truy cập vào địa chỉ hiển thị trên màn hình (thường là `http://localhost:5173`).

- **Để chạy Phần A (JavaScript thuần):**
  - Mở file `phan-a/index.html` bằng extension **Live Server** trong VS Code (chuột phải vào `index.html` -> chọn **Open with Live Server**).
  - *(Lưu ý: Không nên nháy đúp trực tiếp file `index.html` trong File Explorer (dạng `file://`) vì chính sách bảo mật CORS của trình duyệt sẽ chặn hàm `fetch` đọc file `books.json`)*.

---

## 3. Các chức năng đã hoàn thành

### Phần A – JavaScript thuần:
1. **Bố cục & Semantic**: Sử dụng các thẻ semantic (`header`, `main`, `section`, `article`, `footer`, `form`). Bố cục Flexbox và Grid responsive (3 cột trên máy tính, 1 cột trên điện thoại).
2. **ES Modules**: Tách logic thành các file riêng biệt (`api.js`, `storage.js`, `validate.js`, `main.js`).
3. **Tải dữ liệu bằng fetch + async/await**: Có trạng thái "Đang tải..." và hiển thị lỗi màu đỏ nếu xảy ra sự cố. Thẻ sách được tạo hoàn toàn bằng `document.createElement` và `textContent`.
4. **Tìm kiếm & Lọc kết hợp**: Tìm kiếm tức thì khi gõ vào ô input; lọc thể loại dựa trên danh sách tạo bằng `new Set`. Hiển thị dòng trạng thái: `Đang hiển thị x / y cuốn`.
5. **Event Delegation & LocalStorage**: Nút Yêu thích và Xóa được xử lý bằng kỹ thuật Event Delegation trên container `#bookGrid`. Số lượng yêu thích cập nhật ngay trên Header và được lưu bền vững vào `localStorage`. Khi xóa có hộp thoại xác nhận `confirm()`.
6. **Validate Form**: Báo lỗi ngay dưới ô nhập khi đang gõ (`input`) và khi bấm gửi (`submit`). Tên sách tối thiểu 3 ký tự, tác giả bắt buộc, phải chọn thể loại, năm từ 1900 đến hiện tại. Sách mới được thêm vào đầu danh sách.
7. **Nâng cao**: Có nút chuyển đổi chế độ Sáng / Tối (Dark / Light mode).

### Phần B – React cơ bản:
1. Dự án khởi tạo bằng Vite.
2. Dữ liệu sách đặt trong file riêng `src/data/books.js`.
3. Chia component rõ ràng: `Header`, `Section` (dùng `children`), `GenreFilter`, `BookList`, `BookCard`, `Footer`.
4. Dữ liệu truyền xuống bằng `props`, danh sách thẻ sách có thuộc tính `key={book.id}` duy nhất.
5. Component `App` nắm giữ State danh sách yêu thích (`favorites`), truyền hàm xử lý `handleToggleFavorite` xuống từng `BookCard` qua props; Header nhận `favoriteCount` và cập nhật tức thì.
6. Lọc sách theo thể loại bằng các nút bấm.
7. Hỗ trợ giao diện Sáng / Tối và tìm kiếm theo tên sách.

---

## 4. So sánh cách làm của Phần A (DOM thuần) và Phần B (React)

| Tiêu chí | Phần A: JavaScript thuần (DOM) | Phần B: React (Vite) |
| :--- | :--- | :--- |
| **Tư duy lập trình** | **Mệnh lệnh (Imperative)**: Lập trình viên phải trực tiếp chỉ đạo trình duyệt từng bước: tìm phần tử (`querySelector`), tạo phần tử (`createElement`), gán dữ liệu (`textContent`), thêm vào cây DOM (`appendChild`), hoặc xóa node (`remove`). | **Khai báo (Declarative)**: Lập trình viên chỉ cần mô tả giao diện sẽ trông như thế nào tương ứng với dữ liệu (State). Khi State thay đổi, React tự động cập nhật giao diện thông qua cơ chế Virtual DOM. |
| **Quản lý trạng thái (State)** | Dữ liệu và giao diện tách rời nhau. Khi dữ liệu trong mảng thay đổi, phải gọi hàm render lại thủ công hoặc tự tay cập nhật từng phần tử liên quan (ví dụ: tự đổi text header, tự đổi class nút yêu thích). Rất dễ xảy ra lỗi không đồng bộ giữa dữ liệu và màn hình. | Trạng thái tập trung tại một nơi thông qua hook `useState`. Mối quan hệ là "Giao diện = hàm số của Trạng thái" (UI = f(State)). Chỉ cần gọi `setFavorites` hoặc `setBooks`, toàn bộ component liên quan sẽ tự động re-render đồng bộ. |
| **Cấu trúc & Tái sử dụng** | Viết HTML tĩnh kết hợp việc lắp ghép chuỗi HTML hoặc tạo element thủ công trong JS. Khó chia nhỏ và tái sử dụng giao diện, code dễ bị phình to và khó bảo trì. | Phân chia thành các **Component** nhỏ, độc lập (`Header`, `Section`, `BookCard`...). Khả năng tái sử dụng rất cao, dễ dàng truyền dữ liệu qua `props` và bọc nội dung linh hoạt bằng `children`. |
| **Xử lý sự kiện (Event Handling)** | Đối với các phần tử được sinh ra động (thẻ sách, nút xóa, nút yêu thích), phải dùng kỹ thuật **Event Delegation** (bắt sự kiện click ở thẻ cha rồi kiểm tra `target.closest` hoặc `target.classList`). | Gắn sự kiện trực tiếp vào thẻ JSX (`onClick={...}`) một cách trực quan, truyền hàm xử lý từ cha xuống con qua `props` dễ dàng mà không cần lo lắng về việc phần tử sinh ra động. |
| **Hiệu năng & Tối ưu** | Thao tác trực tiếp trên Real DOM. Nếu viết không cẩn thận (như liên tục gọi innerHTML hoặc appendChild nhiều lần) sẽ gây reflow/repaint làm giảm hiệu năng trình duyệt. | Sử dụng **Virtual DOM**. React so sánh sự khác biệt (diffing algorithm) và chỉ cập nhật đúng những node thực sự thay đổi trên Real DOM. |

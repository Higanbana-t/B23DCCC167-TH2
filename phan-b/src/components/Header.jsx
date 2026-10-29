function Header({ favoriteCount = 0 }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1>Thư Viện Sách Lớp Học (React)</h1>
        <div className="fav-badge">
          Yêu thích: <strong>{favoriteCount}</strong> cuốn
        </div>
      </div>
    </header>
  );
}

export default Header;

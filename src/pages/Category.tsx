import { useState } from "react";
import "./Category.css";

export default function Category() {
  const [items, setItems] = useState<string[]>([]);
  const [input, setInput] = useState("");

  // 항목 "추가" 버튼 클릭 또는 Enter 입력 시 호출되는 함수
  const handleAdd = () => {
    // 공백 제거 (앞뒤 공백 삭제)
    const trimmed = input.trim();
    if (!trimmed) return;
    setItems((prev) => [...prev, trimmed]);
    setInput("");
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="ff-page">
      <div className="ff-shell">
        {/* 헤더 */}
        <header className="ff-header">
          <div className="ff-logo">
            <div className="ff-logo-mark">❓</div>
            <span className="ff-logo-text">Fate factory</span>
          </div>
        </header>

        {/* 모드 탭 */}
        <h2>룰렛 모드</h2>
        <nav className="ff-mode-tabs">
          <button className="ff-mode-btn ff-mode-btn--active">원형 룰렛</button>
          <button className="ff-mode-btn">텍스트 아레나</button>
          <button className="ff-mode-btn">컬링</button>
          <button className="ff-mode-btn">사다리타기</button>
        </nav>

        {/* 메인 영역 */}
        <main className="ff-main">
          {/* 왼쪽: 항목 편집 */}
          <section className="ff-left">
            <h2 className="ff-left-title">항목 편집</h2>
            <div className="ff-input-row">
              <input
                className="ff-input"
                placeholder="새 항목 추가..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="ff-add-btn" onClick={handleAdd}>
                추가
              </button>
            </div>
            <ul className="ff-item-list">
              {items.length === 0 && (
                <li className="ff-item-empty">아직 추가된 항목이 없어요.</li>
              )}
              {items.map((item, idx) => (
                <li key={idx} className="ff-item">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 오른쪽: 카테고리들 */}
          <section className="ff-right">
            <div className="ff-section">
              <h3 className="ff-section-title">인기 카테고리</h3>
              <div className="ff-hot-chip-grid">
                {popularCategories.map((c) => (
                  <button key={c.label} className="ff-chip">
                    <span className="ff-chip-emoji">{c.emoji}</span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="ff-section">
              <h3 className="ff-section-title">카테고리</h3>
              <div className="ff-chip-grid--4">
                {otherCategories.map((c) => (
                  <button key={c.label} className="ff-chip">
                    <span className="ff-chip-emoji">{c.emoji}</span>
                    <span className="ff-chip-label">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <button className="ff-start-btn">내가 고른 룰렛 시작!</button>
          </section>
        </main>
      </div>
    </div>
  );
}

// =====================
// 카테고리 데이터 정의
// =====================

// '인기 카테고리'에 보여줄 버튼 목록
const popularCategories = [
  { emoji: "🍚", label: "밥 뭐먹지" },
  { emoji: "🥤", label: "음료 뭐마시지" },
  { emoji: "📺", label: "넷플 뭐보지" },
  { emoji: "🎬", label: "유튜브 뭐보지" },
];

// '카테고리' 영역에 보여줄 일반 카테고리 버튼 목록
const otherCategories = [
  { emoji: "🧩", label: "보드게임\n뭐하지" },
  { emoji: "🎮", label: "게임 뭐하지" },
  { emoji: "👗", label: "옷 뭐입지" },
  { emoji: "💡", label: "음악 뭐듣지" },
  { emoji: "📚", label: "책 뭐읽지" },
  { emoji: "🍺", label: "술 뭐마시지" },
  { emoji: "✈️", label: "국내여행\n어디가지" },
  { emoji: "🌍", label: "해외여행\n어디가지" },
  { emoji: "🍪", label: "간식 뭐먹지" },
  { emoji: "💅", label: "네일 뭐하지" },
  { emoji: "🍜", label: "라면 뭐먹지" },
  { emoji: "🧹", label: "집안일\n뭐부터 하지" },
  { emoji: "💪", label: "운동 뭐하지" },
  { emoji: "📝", label: "공부 뭐하지" },
  { emoji: "💢", label: "기분 뭐하지" },
  { emoji: "❓", label: "뭐 고르지" },
];

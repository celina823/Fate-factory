import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Category.css";
import LogoImg from "../assets/ff-logo-img.png";
import { useRouletteItemsStore } from "../stores/useRouletteItemsStore";

export default function Category() {
  const [mode, setMode] = useState("원형 룰렛");
  const [input, setInput] = useState("");
  const { items, addItem, addPresets, clearItems, removeItem } =
    useRouletteItemsStore();

  const navigate = useNavigate();

  const handleCategoryClick = (label: string) => {
    const preset = categoryPresets[label];
    if (!preset) return;

    clearItems();
    addPresets(preset);
  };

  // 항목 "추가" 버튼 클릭 또는 Enter 입력 시 호출되는 함수
  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    addItem(trimmed); // 전역 상태에 추가

    const currentItems = useRouletteItemsStore.getState().items;
    console.log("🟢 zustand items after add:", currentItems);

    setInput("");
  };

  // --- 유효성 검사 로직 추가 ---
  const itemCount = items.length;

  const getValidation = () => {
    // 1. 컬링 모드 체크
    if (mode === "컬링") {
      if (itemCount < 4)
        return { isValid: false, msg: "항목을 4개 이상 등록해주세요" };
    }
    // 2. 사다리타기 모드 체크
    else if (mode === "사다리타기") {
      if (itemCount < 4 || itemCount > 15)
        return { isValid: false, msg: "항목을 4~15개 등록해주세요" };
    }
    // 3. 항목이 0개일 때
    if (itemCount === 0)
      return { isValid: false, msg: "항목을 먼저 추가해주세요" };

    // 3. 모드 공통 체크
    if (itemCount < 2) {
      return { isValid: false, msg: "항목을 2개 이상 등록해주세요" };
    }
    return { isValid: true, msg: "" };
  };

  const { isValid, msg } = getValidation();

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="ff-page">
      <img src={LogoImg} alt="Fate Factory Logo" className="ff-logo-img" />
      <div className="ff-shell">
        {/* 모드 탭 */}
        <h2>룰렛 모드</h2>
        <nav className="ff-mode-tabs">
          <button
            className={`ff-mode-btn ${
              mode === "원형 룰렛" ? "ff-mode-btn--active" : ""
            }`}
            onClick={() => setMode("원형 룰렛")}
          >
            원형 룰렛
          </button>
          <button
            className={`ff-mode-btn ${
              mode === "텍스트 아레나" ? "ff-mode-btn--active" : ""
            }`}
            onClick={() => setMode("텍스트 아레나")}
          >
            텍스트 아레나
          </button>
          <button
            className={`ff-mode-btn ${
              mode === "컬링" ? "ff-mode-btn--active" : ""
            }`}
            onClick={() => setMode("컬링")}
          >
            <span className="ff-mode-text">컬링</span>
            <p className="ff-mode-info">(최소 4인)</p>
          </button>
          <button
            className={`ff-mode-btn ${
              mode === "팩맨" ? "ff-mode-btn--active" : ""
            }`}
            onClick={() => setMode("팩맨")}
          >
            팩맨
          </button>
          <button
            className={`ff-mode-btn ${
              mode === "가라폰" ? "ff-mode-btn--active" : ""
            }`}
            onClick={() => setMode("가라폰")}
          >
            가라폰
          </button>
          <button
            className={`ff-mode-btn ${
              mode === "사다리타기" ? "ff-mode-btn--active" : ""
            }`}
            onClick={() => setMode("사다리타기")}
          >
            <span className="ff-mode-text">사다리타기</span>
            <p className="ff-mode-info">(최소 2인 / 최대 15인)</p>
          </button>
        </nav>

        {/* 메인 영역 */}
        <main className="ff-main">
          {/* 왼쪽: 항목 편집 */}
          <section className="ff-left">
            <div className="ff-left-header">
              <h2 className="ff-left-title">항목 편집</h2>
              {items.length > 0 && (
                <button className="ff-clear-btn" onClick={clearItems}>
                  전체 삭제
                </button>
              )}
            </div>
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
                  <span className="ff-item-text">{item}</span>
                  <button
                    className="ff-item-delete-btn"
                    onClick={() => removeItem(idx)}
                  >
                    삭제
                  </button>
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
                  <button
                    key={c.label}
                    className="ff-chip"
                    onClick={() => handleCategoryClick(c.label)}
                  >
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
                  <button
                    key={c.label}
                    className="ff-chip"
                    onClick={() => handleCategoryClick(c.label)}
                  >
                    <span className="ff-chip-emoji">{c.emoji}</span>
                    <span className="ff-chip-label">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div
              className={`ff-start-btn-wrapper ${
                !isValid ? "has-tooltip" : ""
              }`}
              data-tooltip={msg}
            >
              <button
                className="ff-start-btn"
                disabled={!isValid}
                onClick={() => {
                  const url = modeToUrl[mode];
                  // 1) URL이 존재하지 않음
                  if (!url) {
                    alert("아직 준비 중인 모드입니다!");
                    return;
                  }

                  // 2) 항목이 비어 있음 → 룰렛 돌릴 내용 없음
                  if (items.length === 0) {
                    alert("항목을 먼저 추가해주세요!");
                    return;
                  }
                  navigate(url);
                }}
              >
                내가 고른 룰렛 시작!
              </button>
            </div>
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

const categoryPresets: Record<string, string[]> = {
  "밥 뭐먹지": ["김치찌개", "제육볶음", "파스타", "비빔밥", "햄버거"],

  "음료 뭐마시지": [
    "아메리카노",
    "바닐라라떼",
    "녹차",
    "홍시주스",
    "망고스무디",
  ],

  "넷플 뭐보지": ["로맨스", "코미디", "스릴러", "다큐", "애니메이션"],

  "유튜브 뭐보지": ["브이로그", "요리 채널", "게임 스트리밍", "먹방", "ASMR"],

  "보드게임\n뭐하지": ["할리갈리", "스플렌더", "루미큐브", "뱅", "부루마블"],

  "게임 뭐하지": ["롤", "배그", "발로란트", "스타듀밸리", "오버워치"],

  "옷 뭐입지": ["후드티", "정장", "셔츠", "원피스", "베스트"],

  "음악 뭐듣지": ["팝", "발라드", "힙합", "R&B", "OST"],

  "책 뭐읽지": ["소설", "자기계발", "판타지", "에세이", "추리"],

  "술 뭐마시지": ["맥주", "소주", "와인", "칵테일", "막걸리"],

  "국내여행\n어디가지": ["부산", "강릉", "여수", "제주", "속초"],

  "해외여행\n어디가지": ["일본", "대만", "태국", "유럽", "미국"],

  "간식 뭐먹지": ["쿠키", "아이스크림", "초콜릿", "과자", "빵"],

  "네일 뭐하지": ["프렌치", "글리터", "자석젤", "체크", "그라데이션"],

  "라면 뭐먹지": ["진라면", "신라면", "불닭볶음면", "너구리", "짜파게티"],

  "집안일\n뭐부터 하지": [
    "설거지",
    "빨래",
    "청소기 돌리기",
    "먼지닦기",
    "휴지통 비우기",
  ],

  "운동 뭐하지": ["러닝", "홈트", "요가", "필라테스", "웨이트"],

  "공부 뭐하지": ["토익", "개발 공부", "자격증", "독서", "필기정리"],

  "기분 뭐하지": ["여유로움", "활기참", "즐거움", "편안함", "신남"],

  "뭐 고르지": [],
};

// 모드→url매핑
const modeToUrl: Record<string, string> = {
  "원형 룰렛": "/roulette",
  "텍스트 아레나": "/text-arena",
  컬링: "/curling",
  팩맨: "/pacman",
  가라폰: "/gashapon",
  사다리타기: "/ladder",
};

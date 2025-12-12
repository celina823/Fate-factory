import { useMemo } from "react";
import { useRouletteItemsStore } from "../stores/useRouletteItemsStore";
import Ladder from "../components/Ladder"; // 사다리 UI 컴포넌트

export default function LadderPage() {
  // 1. zustand store에서 룰렛 항목(items)을 가져오기
  const { items: results } = useRouletteItemsStore(); // 이름을 results로 변경하여 사용

  if (results.length === 0) {
    return (
      <div className="ff-page">
        <h1>사다리타기</h1>
        <p>항목이 없습니다. 항목 설정 페이지로 돌아가서 항목을 추가해주세요.</p>
        <button onClick={() => window.history.back()}>돌아가기</button>
      </div>
    );
  }

  // 2. 출발 항목(starters)을 items의 길이에 맞춰 숫자 1부터 생성합니다.
  const starters = useMemo(() => {
    return Array.from({ length: results.length }, (_, i) => `${i + 1}`);
  }, [results.length]); // results.length가 변할 때만 다시 계산

  return (
    <div className="ff-page ff-ladder-page">
      <h1>사다리타기</h1>
      <p className="ff-subtitle">도착 결과: {results.length}개 항목</p>

      <div className="ff-ladder-container">
        {/*
          - starters: 1, 2, 3, ... (숫자)
          - results: 사용자가 입력한 항목 (김치찌개, 파스타, ...)
        */}
        <Ladder starters={starters} results={results} />
      </div>
    </div>
  );
}

// src/components/Ladder.tsx

import React, { useState, useMemo } from "react";

interface LadderProps {
  starters: string[]; // 사다리 출발 항목 (예: 1, 2, 3)
  results: string[]; // 사다리 도착 항목 (예: 김치찌개, 파스타)
}

// =======================================================
// 1. 사다리 로직 및 상수 (컴포넌트 외부)
// =======================================================

const RAIL_WIDTH = 100; // 수직선 간격 (픽셀)
const RAIL_HEIGHT = 400; // 사다리 전체 높이
const RUNG_COUNT = 15; // 무작위로 생성할 수평선 최대 개수

// 사다리 구조를 무작위로 생성하는 함수
const generateLadderStructure = (numRails: number) => {
  const rungs: { [key: number]: number[] } = {}; // { railIndex: [rungYPosition, ...] }

  for (let i = 0; i < numRails - 1; i++) {
    rungs[i] = [];
    const maxRungs = Math.floor(Math.random() * RUNG_COUNT) + 5;

    for (let j = 0; j < maxRungs; j++) {
      // 50~RAIL_HEIGHT-50 사이의 Y 좌표를 무작위로 선택
      const y = Math.floor(Math.random() * (RAIL_HEIGHT - 100)) + 50;
      rungs[i].push(y);
    }
    rungs[i].sort((a, b) => a - b);
  }
  return rungs;
};

// 특정 시작점에서 최종 결과를 찾는 함수 (핵심 로직)
const findResultPath = (
  startIndex: number,
  rungs: { [key: number]: number[] },
  numRails: number
) => {
  let currentRail = startIndex;
  let currentY = 0; // 사다리의 맨 위부터 시작
  const path: { x: number; y: number }[] = [];
  // 1. 시작점 저장
  path.push({ x: currentRail * RAIL_WIDTH, y: currentY });

  while (currentY < RAIL_HEIGHT) {
    currentY += 1; // 1픽셀 단위로 경로 추적

    let moved = false;
    const oldRail = currentRail; // 이동 전 레일 위치 저장

    // 1. 오른쪽으로 이동할 수 있는지 확인 (경계 체크 포함)
    if (
      currentRail < numRails - 1 && // 💡 경계 체크
      rungs[currentRail] &&
      rungs[currentRail].includes(currentY)
    ) {
      // 💡 [수정] 수평 이동 직전에 현재 Y 좌표의 점을 저장 (수직선의 끝점)
      path.push({ x: oldRail * RAIL_WIDTH, y: currentY });
      currentRail += 1;
      moved = true;
    }
    // 2. 왼쪽으로 이동할 수 있는지 확인 (경계 체크 포함)
    else if (
      currentRail > 0 && // 💡 경계 체크
      rungs[currentRail - 1] &&
      rungs[currentRail - 1].includes(currentY)
    ) {
      // 💡 [수정] 수평 이동 직전에 현재 Y 좌표의 점을 저장 (수직선의 끝점)
      path.push({ x: oldRail * RAIL_WIDTH, y: currentY });
      currentRail -= 1;
      moved = true;
    }

    // 💡 [수정]
    // 수평 이동이 발생했다면, 이동 후의 점 (수평선의 끝점)을 저장
    if (moved) {
      path.push({ x: currentRail * RAIL_WIDTH, y: currentY });
    }

    // 💡 [수정] 경로 저장 조건을 단순화: 50px 간격 저장 조건을 제거하거나,
    // 최소한으로 줄여서 데이터 밀도를 높입니다.
    // 여기서는 50px 간격 저장을 제거하고, moved가 아닐 경우에도 일정 간격으로 저장합니다.
    if (!moved && currentY % 10 === 0) {
      // 10픽셀 간격으로 저장하여 대각선을 방지
      path.push({ x: currentRail * RAIL_WIDTH, y: currentY });
    }
  }

  // 2. 최종 도착점 저장
  path.push({ x: currentRail * RAIL_WIDTH, y: RAIL_HEIGHT });

  const finalResultIndex = currentRail;
  return { path, finalIndex: finalResultIndex };
};

// 💡 빨간 줄 오류 해결: 경로의 총 길이를 계산하는 함수 (컴포넌트 외부로 이동)
const calculatePathLength = (path: { x: number; y: number }[]): number => {
  let length = 0;
  for (let i = 1; i < path.length; i++) {
    const dx = path[i].x - path[i - 1].x;
    const dy = path[i].y - path[i - 1].y;
    length += Math.sqrt(dx * dx + dy * dy);
  }
  return length;
};

// =======================================================
// 2. Ladder 컴포넌트
// =======================================================

export default function Ladder({ starters, results }: LadderProps) {
  const numRails = starters.length;

  // 항목 수에 따라 사다리 구조 재생성
  const ladderRungs = useMemo(
    () => generateLadderStructure(numRails),
    [numRails]
  );

  const [activeStarterIndex, setActiveStarterIndex] = useState<number | null>(
    null
  );
  const [pathResult, setPathResult] = useState<{
    path: { x: number; y: number }[];
    finalIndex: number;
  } | null>(null);

  // 💡 경로 애니메이션 상태: pathLength 값이 strokeDashoffset으로 사용됨
  const [pathLength, setPathLength] = useState(0);

  // 경로를 추적하고 결과를 표시하는 핸들러
  const handleStart = (index: number) => {
    setActiveStarterIndex(index);

    // 1. 애니메이션 리셋 및 새 경로 계산
    setPathResult(null); // polyline 제거 (transition 리셋)

    const result = findResultPath(index, ladderRungs, numRails);
    const length = calculatePathLength(result.path);

    // 2. 애니메이션 초기화: 경로 길이만큼 offset을 설정하여 선을 완전히 숨김
    setPathLength(length);
    setPathResult(result);

    // 3. 애니메이션 시작: 다음 렌더링 사이클에서 offset을 0으로 설정 (3초간 선이 그려짐)
    setTimeout(() => {
      // 0으로 설정하면 length -> 0으로 transition이 시작됨
      setPathLength(0);
    }, 50); // 렌더링 후 지연 (React의 다음 프레임)
  };

  const totalWidth = numRails * RAIL_WIDTH;

  // polyline의 strokeDasharray에 사용할 실제 경로 길이
  const actualPathLength = useMemo(() => {
    if (!pathResult) return 0;
    return calculatePathLength(pathResult.path);
  }, [pathResult]);

  return (
    <div className="ladder-game-wrapper">
      {/* 4. 출발 항목 UI (맨 위에 위치) */}
      <div className="ladder-starters" style={{ width: totalWidth, order: 1 }}>
        {starters.map((item, index) => (
          <button
            key={index}
            onClick={() => handleStart(index)}
            className={`starter-btn ${
              activeStarterIndex === index ? "active" : ""
            }`}
            style={{ width: RAIL_WIDTH }}
          >
            {item}
          </button>
        ))}
      </div>

      {/* 5. SVG 사다리 (중앙에 위치) */}
      <svg
        width={totalWidth}
        height={RAIL_HEIGHT + 100}
        viewBox={`0 0 ${totalWidth} ${RAIL_HEIGHT + 100}`}
        style={{ order: 2 }}
      >
        {/* 1. 수직선 (Rails) 그리기 */}
        {starters.map((_, index) => (
          <line
            key={`rail-${index}`}
            x1={index * RAIL_WIDTH + RAIL_WIDTH / 2}
            y1={50} // 오프셋 적용
            x2={index * RAIL_WIDTH + RAIL_WIDTH / 2}
            y2={RAIL_HEIGHT + 50} // 오프셋 적용
            stroke="#aaa"
            strokeWidth="3"
          />
        ))}

        {/* 2. 수평선 (Rungs) 그리기 */}
        {Object.entries(ladderRungs).flatMap(([railIndexStr, yPositions]) => {
          const railIndex = parseInt(railIndexStr);
          return yPositions.map((y, i) => (
            <line
              key={`rung-${railIndex}-${i}`}
              x1={railIndex * RAIL_WIDTH + RAIL_WIDTH / 2}
              x2={(railIndex + 1) * RAIL_WIDTH + RAIL_WIDTH / 2}
              y1={y + 50} // 오프셋 적용
              y2={y + 50} // 오프셋 적용
              stroke="#555"
              strokeWidth="3"
            />
          ));
        })}

        {/* 3. 추적 경로 그리기 - 애니메이션 적용! */}
        {pathResult && (
          <polyline
            fill="none"
            stroke="red"
            strokeWidth="5"
            points={pathResult.path
              .map((p) => `${p.x + RAIL_WIDTH / 2},${p.y + 50}`)
              .join(" ")}
            style={{
              // 선의 길이 = 실제 경로 길이
              strokeDasharray: actualPathLength,
              // 3초간 애니메이션 적용
              transition: "stroke-dashoffset 5s linear",
              // pathLength (length -> 0) 값에 따라 오프셋이 움직임
              strokeDashoffset: pathLength,
            }}
          />
        )}
      </svg>

      {/* 6. 결과 항목 UI (맨 아래에 위치) */}
      <div className="ladder-results" style={{ width: totalWidth, order: 3 }}>
        {results.map((result, index) => (
          <div
            key={index}
            className={`result-item ${
              pathResult && pathResult.finalIndex === index
                ? "final-winner"
                : ""
            }`}
            style={{ width: RAIL_WIDTH }}
          >
            {result}
            {pathResult && pathResult.finalIndex === index && (
              <span className="winner-label">당첨!</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

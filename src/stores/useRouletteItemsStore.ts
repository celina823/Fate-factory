import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RouletteItemsState {
  items: string[]; // 현재 들어 있는 모든 항목 목록
  addItem: (text: string) => void; // items 배열 맨 뒤에 새로운 항목을 추가하는 함수 // "추가" 버튼 눌렀을 때 호출
  removeItem: (index: number) => void; // index 위치에 있는 항목 하나를 배열에서 제거
  updateItem: (index: number, text: string) => void; // index 위치에 있는 항목을 새로운 text로 교체
  clearItems: () => void; // items를 빈 배열로 리셋하는 함수
  setItems: (items: string[]) => void; // items 배열 전체를 넘겨준 배열로 통째로 교체하는 함수
}

export const useRouletteItemsStore = create(
  persist<RouletteItemsState>(
    (set) => ({
      items: [],

      addItem: (text) =>
        set((state) => ({
          items: [...state.items, text],
        })),

      removeItem: (index) =>
        set((state) => ({
          items: state.items.filter((_, i) => i !== index),
        })),

      updateItem: (index, text) =>
        set((state) => ({
          items: state.items.map((item, i) => (i === index ? text : item)),
        })),

      clearItems: () => set({ items: [] }),

      setItems: (items) => set({ items }),
    }),
    {
      name: "roulette-items", // 새로고침해도 유지
    }
  )
);

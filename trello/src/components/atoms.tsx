import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
//  https://velog.io/@eunjeong/TIL-Recoil-persist
// localStorage에 데이터 저장

export interface ITodo {
    id: number;
    text: string;
}

export interface ITodoState {
    [key: string]: ITodo[];
}

const { persistAtom } = recoilPersist();

export const todoState = atom<ITodoState>({
    key: "todo",
    default: {},
    effects_UNSTABLE: [persistAtom],
});

export const boardState = atom<string[]>({
    key: "board",
    default: [],
    effects_UNSTABLE: [persistAtom],
});

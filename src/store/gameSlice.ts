import Puzzle, {PuzzleAnswer} from "@/models/Puzzle";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HexadecimalColor} from "@/components/BoardTileSelector";

export enum GameStates {
  Loading,
  OnBoard,
  Playing,
  Paused,
  Over,
}

export interface GameState {
  currentState: GameStates,
  previousState: GameStates,
  foundAnswers: PuzzleAnswer[],
  usedColors: HexadecimalColor[],
  availableColors: HexadecimalColor[],
}
// const oldPlayer = JSON.parse(localStorage.getItem('OLD_PLAYER') ?? 'false');
// const foundAnswers = JSON.parse(localStorage.getItem('FOUND_ANSWERS') as string);
const gameStateSlice = createSlice({
  name: 'game',
  initialState: {
    currentState: GameStates.Loading,
    previousState: GameStates.Loading,
    foundAnswers: [] as PuzzleAnswer[],
    usedColors: [] as HexadecimalColor[],
    availableColors: ['#DBEBB7', '#C3EAEB', '#EADBAB', '#E6A9EB', '#EBB5A0'] as HexadecimalColor[],
  } as GameState,
  reducers: {
    restore: (state) => {
      const previousStateRaw = localStorage.getItem('APP_STATE');

      if (previousStateRaw === null) {
        return;
      }

      const previousState = JSON.parse(previousStateRaw) as GameState;

      state.foundAnswers = [...previousState.foundAnswers];
      state.usedColors = [...previousState.usedColors]
      state.availableColors = [...previousState.availableColors];
      state.currentState = previousState.currentState;
    },
    play(state) {
      state.previousState = state.currentState;
      state.currentState = GameStates.Playing;
      localStorage.setItem('APP_STATE', JSON.stringify(state));
    },
    pause(state) {
      state.previousState = state.currentState;
      state.currentState = GameStates.Paused;
    },
    resume(state) {
      state.currentState = state.previousState;
      state.previousState = GameStates.Paused;
    },
    finish(state) {
      state.previousState = state.currentState;
      state.currentState = GameStates.Over;
    },
    addFoundAnswers(state, action: PayloadAction<PuzzleAnswer>) {
      state.foundAnswers = [...state.foundAnswers, action.payload];
      localStorage.setItem('APP_STATE', JSON.stringify(state));
    },
    useColor(state, action: PayloadAction<HexadecimalColor>) {
      state.usedColors = [...state.usedColors, action.payload];
      state.availableColors = state.availableColors.filter(c => c !== action.payload);
      localStorage.setItem('APP_STATE', JSON.stringify(state));
    },
    reset(state) {
      state.currentState = GameStates.Playing;
      state.previousState = GameStates.Playing;
      state.foundAnswers = [];
      state.availableColors = ['#DBEBB7', '#C3EAEB', '#EADBAB', '#E6A9EB', '#EBB5A0'];
      state.usedColors = [];
      localStorage.setItem('APP_STATE', JSON.stringify(state));
    },
  },
});

export default gameStateSlice;

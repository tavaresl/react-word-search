import Puzzle, {Answer, AnswerFound} from "@/models/Puzzle";
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
  answersFound: AnswerFound[],
  usedColors: HexadecimalColor[],
  availableColors: HexadecimalColor[],
}

const initialState: GameState = {
  currentState: GameStates.Loading,
  previousState: GameStates.Loading,
  answersFound: [] as AnswerFound[],
  usedColors: [] as HexadecimalColor[],
  availableColors: ['#DBEBB7', '#C3EAEB', '#EADBAB', '#E6A9EB', '#EBB5A0'] as HexadecimalColor[],
};

const gameStateSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    restore: (state) => {
      const previousStateRaw = localStorage.getItem('APP_STATE');

      if (previousStateRaw === null) {
        return;
      }

      const previousState = JSON.parse(previousStateRaw) as GameState;

      state.answersFound = [...previousState.answersFound];
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
    addAnswerFound(state, action: PayloadAction<AnswerFound>) {
      state.answersFound = [...state.answersFound, action.payload];
      state.availableColors = state.availableColors.filter(c => c !== action.payload.color);
      localStorage.setItem('APP_STATE', JSON.stringify(state));
    },
    reset(state) {
      state.currentState = GameStates.Playing;
      state.previousState = GameStates.Playing;
      state.answersFound = [];
      state.availableColors = ['#DBEBB7', '#C3EAEB', '#EADBAB', '#E6A9EB', '#EBB5A0'];
      state.usedColors = [];
      localStorage.setItem('APP_STATE', JSON.stringify(state));
    },
  },
});

export default gameStateSlice;

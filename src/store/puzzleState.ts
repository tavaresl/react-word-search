import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Puzzle from "@/models/Puzzle";

export interface PuzzleState {
  puzzle?: Puzzle;
}

const initialState: PuzzleState = {
  puzzle: undefined,
};

export const getRandom = createAsyncThunk('puzzle/getRandom', async (thunkAPI) => {
  const storedPuzzle= localStorage.getItem('APP_PUZZLE');

  if (storedPuzzle !== null) {
    console.info('Puzzle restored from cache');
    return JSON.parse(storedPuzzle) as Puzzle;
  }

  try {
    const response = await fetch('/api/puzzle/random');
    const newPuzzle = await response.json() as Puzzle;

    console.info('Puzzle fetched from remote server');
    // localStorage.setItem('APP_PUZZLE', JSON.stringify(newPuzzle));

    return newPuzzle;
  } catch (err) {
    console.warn('No puzzle available on remote server.')
  }
});

const puzzleSlice = createSlice({
  name: 'puzzle',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getRandom.fulfilled, (state, action) => {
      state.puzzle = action.payload;
    });
  },
});


export default puzzleSlice;
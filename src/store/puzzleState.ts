import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Puzzle from "@/models/Puzzle";

export interface PuzzleState {
  puzzle?: Puzzle;
}

const initialState: PuzzleState = {
  puzzle: undefined,
};

export const getRandom = createAsyncThunk('puzzle/getRandom', async (thunkAPI) => {
  const response = await fetch('/api/puzzle/random');
  const puzzle= await response.json() as Puzzle;

  localStorage.setItem('APP_PUZZLE', JSON.stringify(puzzle));

  return puzzle;
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
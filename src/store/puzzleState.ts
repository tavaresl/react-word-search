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
    let attempt = 1;

    while (attempt <= 5) {
      const response = await fetch('/api/puzzle/random');

      if (!response.ok) {
        attempt += 1;
        continue;
      }
  
      const newPuzzle = await response.json() as Puzzle;
      localStorage.setItem('APP_PUZZLE', JSON.stringify(newPuzzle));

      return newPuzzle;
    }

    throw new Error('Could not find any puzzle.');
  } catch (err) {
    console.warn(err);
  }
});

const puzzleSlice = createSlice({
  name: 'puzzle',
  initialState,
  reducers: {
    clear(state) {
      localStorage.removeItem('APP_PUZZLE');
      state.puzzle = undefined;
    },
  },
  extraReducers: builder => {
    builder.addCase(getRandom.fulfilled, (state, action) => {
      state.puzzle = action.payload;
    });
  },
});


export default puzzleSlice;
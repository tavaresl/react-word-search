"use client";
import Board from "@/components/Board";
import Puzzle from "@/models/Puzzle";

export default function Home() {
  const puzzle: Puzzle = {
    theme: 'Xmas',
    width: 5,
    height: 6,
    answers: [
      {
        word: 'santa',
        tiles: [
          { letter: 's', x: 0, y: 0 },
          { letter: 'a', x: 1, y: 1 },
          { letter: 'n', x: 2, y: 2 },
          { letter: 't', x: 3, y: 3 },
          { letter: 'a', x: 4, y: 4 },
        ],
      },
      {
        word: 'gift',
        tiles: [
          { letter: 'g', x: 3, y: 0 },
          { letter: 'i', x: 3, y: 1 },
          { letter: 'f', x: 3, y: 2 },
          { letter: 't', x: 3, y: 3 },
        ],
      },
      {
        word: 'sled',
        tiles: [
          { letter: 's', x: 0, y: 0 },
          { letter: 'l', x: 0, y: 1 },
          { letter: 'e', x: 0, y: 2 },
          { letter: 'd', x: 0, y: 3 },
        ],
      },
      {
        word: 'snow',
        tiles: [
          { letter: 's', x: 0, y: 5 },
          { letter: 'n', x: 1, y: 5 },
          { letter: 'o', x: 2, y: 5 },
          { letter: 'w', x: 3, y: 5 },
        ],
      },
    ],
    looseLetters: [
      { letter: 'b', x: 1, y: 0 },
      { letter: 'c', x: 2, y: 0 },
      { letter: 'j', x: 4, y: 0 },
      { letter: 'w', x: 2, y: 1 },
      { letter: 'u', x: 4, y: 1 },
      { letter: 'v', x: 1, y: 2 },
      { letter: 'n', x: 4, y: 2 },
      { letter: 'p', x: 1, y: 3 },
      { letter: 'q', x: 2, y: 3 },
      { letter: 'd', x: 4, y: 3 },
      { letter: 'z', x: 0, y: 4 },
      { letter: 'k', x: 1, y: 4 },
      { letter: 'i', x: 2, y: 4 },
      { letter: 'y', x: 3, y: 4 },
      { letter: 'r', x: 4, y: 5 },
    ],
  };

  return (
    <main>
      <div>
        <Board puzzle={puzzle} />
      </div>
    </main>
  )
}

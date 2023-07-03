import './Board.scss'
import BoardTile from "@/app/components/BoardTile";
import Puzzle, {PuzzleAnswer, PuzzleTile} from "@/models/Puzzle";
import {CSSProperties, useState} from "react";
import BoardTileSelector from "@/app/components/BoardTileSelector";

export default function Board({ puzzle }: { puzzle: Puzzle }) {
  const [isSelecting, setSelecting] = useState<boolean>(false);
  const [selectedTiles, setSelectedTiles] = useState<PuzzleTile[]>([]);
  const [foundWords, setFoundWords] = useState<PuzzleAnswer[]>([]);

  const tileStyle: CSSProperties = { flexBasis: `calc(${100 / puzzle.width}% - var(--gap))` };
  const tiles = getSortedTiles(puzzle);

  const startSelecting = (initialTile: PuzzleTile) => {
    if (!isSelecting) {
      setSelectedTiles([initialTile]);
      setSelecting(true);
    }
  };

  const handleMouseEnter = (tile: PuzzleTile) => {
    if (!isSelecting) {
      return;
    }

    const lastButOneTile = selectedTiles[selectedTiles.length - 2];

    if (selectedTiles.includes(tile) && lastButOneTile === tile) {
      setSelectedTiles(selectedTiles.slice(0, selectedTiles.length - 1));
    } else if (isSequential(...selectedTiles, tile)) {
      setSelectedTiles([...selectedTiles, tile]);
    }
  };

  const stopSelecting = () => {
    setSelectedTiles([]);
    setSelecting(false);
  };

  return (
    <article>
      <header>
        <h3>{puzzle.theme}</h3>
      </header>

      <main className="Board" onMouseUp={() => stopSelecting()}>
        {
          tiles.map((t, i) => (
            <BoardTile
              key={i}
              tabIndex={i}
              selectable={isSelecting}
              selected={selectedTiles.includes(t)}
              onPointerDown={() => startSelecting(t)}
              onPointerEnter={() => handleMouseEnter(t) }
              style={tileStyle}>
              {t.letter}
            </BoardTile>
          ))
        }

        {
          isSelecting &&
            <BoardTileSelector
                puzzle={puzzle}
                firstTile={selectedTiles[0]}
                lastTile={selectedTiles[selectedTiles.length - 1]} />
        }
      </main>
    </article>
  );
}

function getSortedTiles(puzzle: Puzzle): PuzzleTile[] {
  const allTiles = [
    ...puzzle.looseLetters,
    ...puzzle.answers.flatMap(a => a.tiles),
  ];

  const uniqueTiles = allTiles.reduce((tiles, t) => {
    if (!tiles.find(tile => tile.x === t.x && tile.y === t.y)) {
      return [...tiles, t];
    }

    return tiles;
  }, [] as PuzzleTile[])

  return uniqueTiles.sort((a,b) => a.y === b.y ? a.x - b.x : a.y - b.y);
}

const isSequential = (...tiles: PuzzleTile[]) => {
  if (tiles.length < 2) {
    return false;
  }

  let diffX = tiles[1].x - tiles[0].x;
  let diffY = tiles[1].y - tiles[0].y;

  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i + 1].x - tiles[i].x !== diffX || tiles[i + 1].y - tiles[i].y !== diffY) {
      return false;
    }
  }

  return true;
}
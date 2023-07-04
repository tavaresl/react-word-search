import styles from './Board.module.scss'
import BoardTile from "@/components/BoardTile";
import Puzzle, {PuzzleAnswer, PuzzleTile} from "@/models/Puzzle";
import {CSSProperties, useState} from "react";
import BoardTileSelector, {HexadecimalColor} from "@/components/BoardTileSelector";
import BoardHeader from "@/components/BoardHeader";
import AnswersGrid from "@/components/AnswersGrid";
import Answer from "@/components/Answer";

export default function Board({ puzzle }: { puzzle: Puzzle }) {
  const [isSelecting, setSelecting] = useState<boolean>(false);
  const [selectedTiles, setSelectedTiles] = useState<PuzzleTile[]>([]);
  const [answersFound, setAnswersFound] = useState<PuzzleAnswer[]>([]);
  const [colors, setColors] = useState<HexadecimalColor[]>([
    '#DBEBB7', '#C3EAEB', '#EADBAB', '#E6A9EB', '#EBB5A0',
  ]);
  const [usedColors, setUsedColors] = useState<HexadecimalColor[]>([]);

  const tileStyle: CSSProperties = { flexBasis: `${100 / puzzle.width}%` };
  const tiles = getSortedTiles(puzzle);
  const color = colors[0] as HexadecimalColor;
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
    const selectedWord = selectedTiles.map(t => t.letter).join('');
    const matchedAnswer = puzzle.answers.find(a => a.word === selectedWord);

    if (matchedAnswer && !answersFound.includes(matchedAnswer)) {
      for (let i = 0; i < selectedTiles.length; i++) {
        const xMatch = selectedTiles[i].x === matchedAnswer.tiles[i].x;
        const yMatch = selectedTiles[i].y === matchedAnswer.tiles[i].y;

        if (!xMatch || !yMatch) {
          break;
        }
      }
      
      setAnswersFound([...answersFound, matchedAnswer]);
      setUsedColors([...usedColors, color]);
      setColors([...colors.slice(1), color]);
    }

    setSelectedTiles([]);
    setSelecting(false);
  };

  return (
    <article className={styles.BoardWrapper}>
      <BoardHeader puzzle={puzzle} answersFound={answersFound} />

      <main className={styles.Board} onMouseUp={() => stopSelecting()}>
        {
          tiles.map((t, i) => (
            <BoardTile
              key={i}
              tabIndex={i}
              className={styles.Board__Tile}
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
          answersFound.map((a, i) => (
            <BoardTileSelector
              key={i}
              puzzle={puzzle}
              color={usedColors[i]}
              firstTile={a.tiles[0]}
              lastTile={a.tiles[a.tiles.length - 1]} />
          ))
        }

        {
          isSelecting &&
            <BoardTileSelector
                puzzle={puzzle}
                color={color}
                firstTile={selectedTiles[0]}
                lastTile={selectedTiles[selectedTiles.length - 1]} />
        }
      </main>
      <AnswersGrid>
        { answersFound.map((a, i) => (
          <Answer
            key={i}
            answer={a}
            color={usedColors[i]} />
        ))}
      </AnswersGrid>
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
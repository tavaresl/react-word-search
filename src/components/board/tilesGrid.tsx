import {CSSProperties, DetailedHTMLProps, HTMLAttributes, useMemo, useState} from "react";
import styles from "./tilesGrid.module.scss";
import BoardTile from "@/components/BoardTile";
import BoardTileSelector, {HexadecimalColor} from "@/components/BoardTileSelector";
import Puzzle, {Answer, AnswerFound, Tile} from "@/models/Puzzle";


type BoardLetterGridProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  enabled: boolean,
  puzzle: Puzzle,
  answersFound: AnswerFound[],
  onAnswerFound: (a: AnswerFound) => void;
  availableColors: HexadecimalColor[],
};

export default function TilesGrid({
  enabled,
  puzzle,
  answersFound,
  onAnswerFound,
  availableColors,
  ...props
}: BoardLetterGridProps) {
  const [isSelecting, setSelecting] = useState<boolean>(false);
  const [selectedTiles, setSelectedTiles] = useState<Tile[]>([]);

  const tiles = useMemo(() => getSortedTiles(puzzle), [puzzle]);
  const color = availableColors[0];
  const tileStyle: CSSProperties = { flexBasis: `${100 / puzzle.width}%` };

  const startSelecting = (initialTile: Tile) => {
    if (!enabled) {
      return;
    }

    if (!isSelecting) {
      setSelectedTiles([initialTile]);
      setSelecting(true);
    }
  };

  const stopSelecting = () => {
    const selectedWord = selectedTiles.map(t => t.letter).join('');
    const matchedAnswer = puzzle.answers.find(a => a.word === selectedWord);

    if (matchedAnswer && answerIsValid(matchedAnswer)) {
      onAnswerFound({ answer: matchedAnswer, color: color });
    }

    setSelectedTiles([]);
    setSelecting(false);
  };


  const answerIsValid = (matchedAnswer: Answer): boolean => {
    if (answersFound.find(a => a.answer.word === matchedAnswer.word) !== undefined) {
      return false;
    }

    for (let i = 0; i < selectedTiles.length; i++) {
      const xMatch = selectedTiles[i].x === matchedAnswer.tiles[i].x;
      const yMatch = selectedTiles[i].y === matchedAnswer.tiles[i].y;

      if (!xMatch || !yMatch) {
        return false;
      }
    }

    return true;
  }

  const handleMouseEnter = (tile: Tile) => {
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

  return (
    <section
      className={styles.TilesGrid}
      style={{maxWidth: `calc(${puzzle.width} * var(--tile-max-size)`}}
      onPointerUp={() => stopSelecting()}>
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
        answersFound.map(({ answer, color }, i) => (
          <BoardTileSelector
            key={i}
            puzzle={puzzle}
            color={color}
            firstTile={answer.tiles[0]}
            lastTile={answer.tiles[answer.tiles.length - 1]} />
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
    </section>
  );
}



function getSortedTiles(puzzle: Puzzle): Tile[] {
  const allTiles = [
    ...puzzle.looseLetters,
    ...puzzle.answers.flatMap(a => a.tiles),
  ];

  const uniqueTiles = allTiles.reduce((tiles, t) => {
    if (!tiles.find(tile => tile.x === t.x && tile.y === t.y)) {
      return [...tiles, t];
    }

    return tiles;
  }, [] as Tile[])

  const sortedTiles = uniqueTiles.sort((a,b) => a.y === b.y ? a.x - b.x : a.y - b.y);
  
  console.log(sortedTiles);

  return sortedTiles;
}


const isSequential = (...tiles: Tile[]) => {
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
import '@/extensions/string';
import {CSSProperties, DetailedHTMLProps, HTMLAttributes, PointerEvent, useMemo, useRef, useState} from "react";
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
  const gridRef = useRef<HTMLDivElement>(null);

  const tiles = useMemo(() => getSortedTiles(puzzle), [puzzle]);
  const color = availableColors[0];
  const tileStyle: CSSProperties = { flexBasis: `${100 / puzzle.width}%`, pointerEvents: 'none' };

  const startSelecting = (evt: PointerEvent<HTMLElement>) => {
    if (!enabled) {
      return;
    }

    if (!isSelecting) {
      const tile = getTileByOffset(evt.nativeEvent.offsetX, evt.nativeEvent.offsetY);
      setSelecting(true);
      setSelectedTiles([tile]);
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

    const tilesMatch = (tiles: Tile[]) => {
      for (let i = 0; i < selectedTiles.length; i++) {
        const xMatch = selectedTiles[i].x === tiles[i].x;
        const yMatch = selectedTiles[i].y === tiles[i].y;
  
        if (!xMatch || !yMatch) {
          return false;
        }
      }
  
      return true;
    };

    return tilesMatch(matchedAnswer.tiles) || isPalindrome(matchedAnswer.word) && tilesMatch([...matchedAnswer.tiles].reverse());
  };

  const handlePointerMove = (evt: PointerEvent<HTMLElement>) => {
    if (!isSelecting) {
      return;
    }

    const tile = getTileByOffset(evt.nativeEvent.offsetX, evt.nativeEvent.offsetY);

    if (!tile) {
      stopSelecting();
    } else if (selectedTiles.includes(tile)) {
      setSelectedTiles(selectedTiles.slice(0, selectedTiles.indexOf(tile) + 1));
    } else if (tilesAreSequential(selectedTiles[0], tile)) {
      setSelectedTiles([...getTilesInSequence(selectedTiles[0], tile)]);
    }
  };

  const getTileByOffset = (offsetX: number, offsetY: number): Tile => {
    const gridElement = gridRef.current as HTMLDivElement;
    const gridWidth = Number.parseInt(window.getComputedStyle(gridElement).getPropertyValue('width').replace("px", ''));
    const cellSize = gridWidth / puzzle.width;

    const x = Math.floor(offsetX / cellSize);
    const y = Math.floor(offsetY / cellSize);

    return tiles.find(t => t.x === x && t.y === y) as Tile;
  };

  const tilesAreSequential = (tile1: Tile, tile2: Tile): boolean => {
    if (tile2.x === tile1.x || tile2.y === tile1.y) {
      return true;
    }
  
    return Math.abs(tile2.x - tile1.x) === Math.abs(tile2.y - tile1.y);
  };

  const getTilesInSequence = (firstTile: Tile, lastTile: Tile): Tile[] => {
    const dX = lastTile.x - firstTile.x;
    const dY = lastTile.y - firstTile.y;
    const amount = Math.max(Math.abs(dX), Math.abs(dY)) + 1;
    const tilesInSequence: Tile[] = [firstTile];
    const nextX = () => dX > 0 ? firstTile.x + tilesInSequence.length : firstTile.x - tilesInSequence.length;
    const nextY = () => dY > 0 ? firstTile.y + tilesInSequence.length : firstTile.y - tilesInSequence.length;

    while (tilesInSequence.length < amount) {
      const x = dX === 0 ? firstTile.x : nextX();
      const y = dY === 0 ? firstTile.y : nextY();
      
      tilesInSequence.push(tiles.find(t => t.x === x && t.y === y) as Tile);
    }

    return tilesInSequence;
  };

  const isPalindrome = (word: string) => word.reverse() === word;

  return (
    <section
      ref={gridRef}
      className={styles.TilesGrid}
      style={{maxWidth: `calc(${puzzle.width} * var(--tile-max-size)`}}
      onPointerUp={() => stopSelecting()}
      onPointerLeave={() => stopSelecting()}
      onPointerDown={(e) => startSelecting(e)}
      onPointerMove={(e) => handlePointerMove(e)}>
      {
        tiles.map((t, i) => (
          <BoardTile
            key={i}
            tabIndex={1}
            data-x={t.x}
            data-y={t.y}
            selectable={isSelecting}
            selected={selectedTiles.includes(t)}
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

  return uniqueTiles.sort((a,b) => a.y === b.y ? a.x - b.x : a.y - b.y);;
}

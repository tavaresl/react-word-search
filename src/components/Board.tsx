"use client";

import styles from './Board.module.scss'
import BoardTile from "@/components/BoardTile";
import Puzzle, {PuzzleAnswer, PuzzleTile} from "@/models/Puzzle";
import {CSSProperties, useEffect, useState} from "react";
import BoardTileSelector, {HexadecimalColor} from "@/components/BoardTileSelector";
import BoardHeader from "@/components/BoardHeader";
import AnswersGrid from "@/components/AnswersGrid";
import Answer from "@/components/Answer";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "@/store/store";
import gameStateSlice, {GameStates} from "@/store/gameSlice";
import gameSlice from "@/store/gameSlice";

export default function Board({ puzzle }: { puzzle: Puzzle }) {
  const dispatch = useDispatch();

  const [isSelecting, setSelecting] = useState<boolean>(false);
  const [selectedTiles, setSelectedTiles] = useState<PuzzleTile[]>([]);

  const gameState = useSelector((state: AppState) => state.game.currentState);
  const foundAnswers = useSelector((state: AppState) => state.game.foundAnswers);
  const usedColors = useSelector((state: AppState) => state.game.usedColors);
  const colors = useSelector((state: AppState) => state.game.availableColors);

  const tileStyle: CSSProperties = { flexBasis: `${100 / puzzle.width}%` };
  const tiles = getSortedTiles(puzzle);
  const color = colors[0] as HexadecimalColor;

  const startSelecting = (initialTile: PuzzleTile) => {
    if (gameState !== GameStates.Playing) {
      return;
    }

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

  const answerIsValid = (matchedAnswer: PuzzleAnswer): boolean => {
    if (foundAnswers.find(a => a.word === matchedAnswer.word) !== undefined) {
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

  const stopSelecting = () => {
    const selectedWord = selectedTiles.map(t => t.letter).join('');
    const matchedAnswer = puzzle.answers.find(a => a.word === selectedWord);

    if (matchedAnswer && answerIsValid(matchedAnswer)) {
      dispatch(gameStateSlice.actions.addFoundAnswers(matchedAnswer));
      dispatch(gameStateSlice.actions.useColor(color));
    }

    setSelectedTiles([]);
    setSelecting(false);
  };

  useEffect(() => {
    if (foundAnswers.length === puzzle.answers.length) {
      dispatch(gameStateSlice.actions.finish());
    }
  }, [foundAnswers, puzzle, dispatch]);

  return (
    <article className={styles.Board} onMouseLeave={() => stopSelecting()}>
      <BoardHeader className={styles.Board__Header} puzzle={puzzle} answersFound={foundAnswers} />

      <section
        className={styles.Board__Grid}
        style={{maxWidth: `calc(${puzzle.width} * var(--tile-max-size)`}}
        onMouseUp={() => stopSelecting()}>
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
          foundAnswers.map((a, i) => (
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
      </section>
      <AnswersGrid className={styles.Board__Footer}>
        { foundAnswers.map((a, i) => (
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
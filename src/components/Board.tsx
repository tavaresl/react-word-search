"use client";

import styles from './Board.module.scss'
import Puzzle, {AnswerFound} from "@/models/Puzzle";
import {useEffect} from "react";
import BoardHeader from "@/components/BoardHeader";
import AnswersGrid from "@/components/AnswersGrid";
import AnswerItem from "@/components/AnswerItem";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "@/store/store";
import gameStateSlice, {GameStates} from "@/store/gameSlice";
import TilesGrid from "@/components/board/tilesGrid";

export default function Board({ puzzle }: { puzzle: Puzzle }) {
  const dispatch = useDispatch();

  const gameState = useSelector((state: AppState) => state.game.currentState);
  const foundAnswers = useSelector((state: AppState) => state.game.answersFound);
  const colors = useSelector((state: AppState) => state.game.availableColors);

  const handleAnswerFound = (answerFound: AnswerFound) => {
    dispatch(gameStateSlice.actions.addAnswerFound(answerFound));
  };

  useEffect(() => {
    if (foundAnswers.length === puzzle.answers.length) {
      dispatch(gameStateSlice.actions.finish());
    }
  }, [foundAnswers, puzzle, dispatch]);

  return (
    <article className={styles.Board}>
      <BoardHeader
        puzzle={puzzle}
        answersFound={foundAnswers} />

      <TilesGrid
        enabled={gameState === GameStates.Playing}
        puzzle={puzzle}
        answersFound={foundAnswers}
        onAnswerFound={handleAnswerFound}
        availableColors={colors} />

      <AnswersGrid>
        { foundAnswers.map(({ answer, color }, i) => (
          <AnswerItem
            key={i}
            answer={answer}
            color={color} />
        ))}
      </AnswersGrid>
    </article>
  );
}

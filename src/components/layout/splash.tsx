import styles from "./splash.module.scss";
import {useEffect, useState} from "react";
import gameStateSlice, {GameStates} from "@/store/gameSlice";
import configSlice from "@/store/configSlice";
import {useDispatch, useSelector} from "react-redux";
import {getRandom} from "@/store/puzzleState";
import {AppState} from "@/store/store";

export default function Splash() {
  const dispatch = useDispatch<any>();
  const isBooting = useSelector((appState: AppState) => appState.game.booting);
  const puzzle = useSelector((appState: AppState) => appState.puzzle.puzzle);

  useEffect(() => {
    if (isBooting) {
      dispatch(configSlice.actions.restore());
      dispatch(gameStateSlice.actions.restore());
    }
  }, [isBooting]);

  useEffect(() => {
    if (isBooting) {
      return;
    }

    if (puzzle === undefined) {
      dispatch(getRandom());
    } else {
      dispatch(gameStateSlice.actions.play());
    }
  }, [isBooting, puzzle]);


  return (
    <article className={styles.Splash}>
      Loading...
    </article>
  )
}
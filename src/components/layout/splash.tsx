import styles from "./splash.module.scss";
import {useEffect, useState} from "react";
import gameStateSlice, {GameStates} from "@/store/gameSlice";
import configSlice from "@/store/configSlice";
import {useDispatch, useSelector} from "react-redux";
import {getRandom} from "@/store/puzzleState";
import {AppState} from "@/store/store";

export default function Splash() {
  const dispatch = useDispatch<any>();
  const puzzle = useSelector((appState: AppState) => appState.puzzle.puzzle);

  useEffect(() => {
    dispatch(configSlice.actions.restore());
    dispatch(gameStateSlice.actions.restore());
  }, []);

  useEffect(() => {
    if (puzzle === undefined) {
      dispatch(getRandom());
    } else {
      dispatch(gameStateSlice.actions.play());
    }
  },[puzzle])

  return (
    <article className={styles.Splash}>
      Loading...
    </article>
  )
}
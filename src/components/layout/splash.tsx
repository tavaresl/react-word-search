import styles from "./splash.module.scss";
import {useEffect, useState} from "react";
import gameStateSlice, {GameStates} from "@/store/gameSlice";
import configSlice from "@/store/configSlice";
import {useDispatch} from "react-redux";

export default function Splash() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(configSlice.actions.restore());
    dispatch(gameStateSlice.actions.restore());
    dispatch(gameStateSlice.actions.play())
  }, []);

  return (
    <article className={styles.Splash}>
      Loading...
    </article>
  )
}
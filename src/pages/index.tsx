import styles from './index.module.scss'
import Board from "@/components/Board";
import Puzzle from "@/models/Puzzle";
import GameOverModal from "@/components/layout/gameOverModal";
import {useSelector} from "react-redux";
import {AppState} from "@/store/store";
import {GameStates} from "@/store/gameSlice";
import Head from 'next/head';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';

export const metadata = {
  title: 'React Word Search',
  description: 'Generated by create next pages',
}

export default function Home() {
  const gameState = useSelector((appState: AppState) => appState.game.currentState);
  const puzzle = useSelector((appState: AppState) => appState.puzzle.puzzle) as Puzzle;

  useEffect(() => ReactGA.send({ hitType: 'pageview', page: '/', title: 'Home' }), []);

  return (
    <>
    <Head>
      <title>Word Search | by Lukão Rocha</title>
    </Head>
    <section className={styles.Home}>
      <Board puzzle={puzzle} />
      <GameOverModal visible={gameState === GameStates.Over} />
    </section>
    </>
  );
}

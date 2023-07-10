import {Inter} from 'next/font/google'
import Header from "@/components/layout/header";
import {useSelector} from "react-redux";
import {AppState} from "@/store/store";
import {GameStates} from "@/store/gameSlice";
import Splash from "@/components/layout/splash";
import styles from './layout.module.scss';
import PauseModal from "@/components/layout/pauseModal";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const state = useSelector((state: AppState) => state.game.currentState);

  if (state === GameStates.Loading) {
    return <Splash />
  }

  return (
    <>
      <Header className={[inter.className, styles.Layout__Header].join(' ')} contentHref="#MainContent" />
      <main id="MainContent" className={[inter.className, styles.Layout__Main].join(' ')}>
        {children}
      </main>
      <PauseModal className={[inter.className].join(' ')} visible={state === GameStates.Paused} />
    </>
  )
}

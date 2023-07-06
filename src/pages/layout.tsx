import {Inter} from 'next/font/google'
import Header from "@/components/layout/header";
import {useSelector} from "react-redux";
import {AppState} from "@/store/store";
import {GameStates} from "@/store/gameSlice";
import Splash from "@/components/layout/splash";

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
      <Header />
      <main className={inter.className}>
        {children}
      </main>
    </>
  )
}

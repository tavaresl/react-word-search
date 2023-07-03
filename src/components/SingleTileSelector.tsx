import {BoardTileSelectorProps} from "@/components/BoardTileSelector";
import {CSSProperties} from "react";
import styles from "@/components/BoardTileSelector.module.scss";

export default function SingleTileSelector({ puzzle, firstTile, lastTile, color }: BoardTileSelectorProps) {
  const style: CSSProperties = {
    borderColor: color,
    backgroundColor: color,
    left: `calc(${(100 * (firstTile.x * 2 + 1)) / (puzzle.width * 2)}% - 30px)`,
    top: `calc(${(100 * (firstTile.y * 2 + 1)) / (puzzle.height * 2)}% - 30px)`,
    width: '1px',
    height: '1px',
  };

  return (
    <div className={styles.Board__TileSelector} style={style} />
  )
}
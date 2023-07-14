import styles from './BoardTileSelector.module.scss';
import {CSSProperties} from "react";
import Puzzle, {Tile} from "@/models/Puzzle";
import {BoardTileSelectorProps} from "@/components/BoardTileSelector";

export default function HorizontalTileSelector({ firstTile, lastTile, puzzle, color }: BoardTileSelectorProps) {
  const dx = lastTile.x - firstTile.x;
  const sign = dx > 0 ? '-' : '+';
  const style: CSSProperties = {
    borderColor: color,
    backgroundColor: color,
    left: `calc(${(100 * (firstTile.x * 2 + 1)) / (puzzle.width * 2)}% ${sign} 30px)`,
    top: `calc(${(100 * (firstTile.y * 2 + 1)) / (puzzle.height * 2)}% ${sign} 30px)`,
    width: `${(100 * Math.abs(dx)) / puzzle.width}%`,
    height: '1px',
    transform: `rotate(${dx < 0 ? 180 : 0}deg)`,
  };

  return (
    <div className={styles.Board__TileSelector} style={style} />
  );
}
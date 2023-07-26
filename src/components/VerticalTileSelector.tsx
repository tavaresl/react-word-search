import Puzzle, {Tile} from "@/models/Puzzle";
import {CSSProperties} from "react";
import {BoardTileSelectorProps} from "@/components/BoardTileSelector";
import styles from "@/components/BoardTileSelector.module.scss";

export default function VerticalTileSelector({ firstTile, lastTile, puzzle, color }: BoardTileSelectorProps) {
  const dy = lastTile.y - firstTile.y;
  const sign = dy > 0 ? '-' : '+';
  const style: CSSProperties = {
    borderColor: color,
    backgroundColor: color,
    left: `calc(${(100 * (firstTile.x * 2 + 1)) / (puzzle.width * 2)}% ${sign} calc(var(--tile-max-size) / 3))`,
    top: `calc(${(100 * (firstTile.y * 2 + 1)) / (puzzle.height * 2)}% ${sign} calc(var(--tile-max-size) / 3))`,
    width: '1px',
    height: `${(100 * Math.abs(dy)) / puzzle.height}%`,
    transform: `rotate(${dy < 0 ? 180 : 0}deg)`,
  };

  return (
    <div className={styles.Board__TileSelector} style={style} />
  );
}
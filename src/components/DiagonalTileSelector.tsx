import {BoardTileSelectorProps} from "@/components/BoardTileSelector";
import {CSSProperties} from "react";
import {Tile} from "@/models/Puzzle";
import {Property} from "csstype";
import styles from "@/components/BoardTileSelector.module.scss";

export default function DiagonalTileSelector({ firstTile, lastTile, puzzle, color }: BoardTileSelectorProps) {
  const puzzleSide = puzzle.width > puzzle.height ? puzzle.height : puzzle.width;
  const side = Math.abs(lastTile.x - firstTile.x);
  const rotation = getRotationDeg(firstTile, lastTile);
  const style: CSSProperties = {
    borderColor: color,
    backgroundColor: color,
    left: `calc(${(100 * (firstTile.x * 2 + 1)) / (puzzle.width * 2)}%)`,
    top: `calc(${(100 * (firstTile.y * 2 + 1)) / (puzzle.height * 2)}%)`,
    width: `${Math.sqrt(2) * (100 * Math.abs(side) / puzzleSide)}%`,
    height: '1px',
    transform: `rotate(${rotation}deg)`,
    transformOrigin: getTransformOriginPoint(firstTile, lastTile),
  };

  return (
    <div className={styles.Board__TileSelector} style={style} />
  )
}

const getRotationDeg = (firstTile: Tile, lastTile: Tile) => {
  const dx = lastTile.x - firstTile.x;
  const dy = lastTile.y - firstTile.y;
  if (dx > 0 && dy > 0) {
    return 45;
  } else if (dx > 0 && dy < 0) {
    return -45;
  } else if (dx < 0 && dy > 0) {
    return 135;
  } else {
    return -135;
  }
}

const getTransformOriginPoint = (firstTile: Tile, lastTile: Tile):  Property.TransformOrigin<string | number> => {
  const dx = lastTile.x - firstTile.x;
  const dy = lastTile.y - firstTile.y;

  if (dx > 0 && dy > 0) {
    return '45px -18px';
  } else if (dx > 0 && dy < 0) {
    return '-18px 45px';
  } else if (dx < 0 && dy > 0) {
    return '19px 8px';
  } else {
    return '8px 19px';
  }
}
import Puzzle, {PuzzleTile} from "@/models/Puzzle";
import {CSSProperties} from "react";
import {BoardTileSelectorProps} from "@/app/components/BoardTileSelector";

export default function VerticalTileSelector({ firstTile, lastTile, puzzle }: BoardTileSelectorProps) {
  const dy = lastTile.y - firstTile.y;
  const sign = dy > 0 ? '-' : '+';
  const style: CSSProperties = {
    left: `calc(${(100 * (firstTile.x * 2 + 1)) / (puzzle.width * 2)}% ${sign} 30px)`,
    top: `calc(${(100 * (firstTile.y * 2 + 1)) / (puzzle.height * 2)}% ${sign} 30px)`,
    width: '1px',
    height: `${(100 * Math.abs(dy)) / puzzle.height}%`,
    transform: `rotate(${dy < 0 ? 180 : 0}deg)`,
  };

  return (
    <div className="Board__TileSelector" style={style} />
  );
}
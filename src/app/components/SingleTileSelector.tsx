import {BoardTileSelectorProps} from "@/app/components/BoardTileSelector";
import {CSSProperties} from "react";

export default function SingleTileSelector({ puzzle, firstTile, lastTile }: BoardTileSelectorProps) {
  const style: CSSProperties = {
    left: `calc(${(100 * (firstTile.x * 2 + 1)) / (puzzle.width * 2)}% - 30px)`,
    top: `calc(${(100 * (firstTile.y * 2 + 1)) / (puzzle.height * 2)}% - 30px)`,
    width: '1px',
    height: '1px',
  };

  return (
    <div className="Board__TileSelector" style={style} />
  )
}
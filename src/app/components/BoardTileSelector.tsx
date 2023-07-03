import './BoardTileSelector.scss';
import {DetailedHTMLProps, HTMLAttributes} from "react";
import Puzzle, {PuzzleTile} from "@/models/Puzzle";
import HorizontalTileSelector from "@/app/components/HorizontalTileSelector";
import VerticalTileSelector from "@/app/components/VerticalTileSelector";
import DiagonalTileSelector from "@/app/components/DiagonalTileSelector";
import SingleTileSelector from "@/app/components/SingleTileSelector";

export type BoardTileSelectorProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  puzzle: Puzzle,
  firstTile: PuzzleTile,
  lastTile: PuzzleTile,
}

export default function BoardTileSelector({ puzzle, firstTile, lastTile, ...props }: BoardTileSelectorProps) {
  const dx = lastTile.x - firstTile.x;
  const dy = lastTile.y - firstTile.y;
  const isVertical = dx === 0 && dy !== 0;
  const isHorizontal = dx !== 0 && dy === 0;
  const isDiagonal = dx !== 0 && dy !== 0;

  if (isHorizontal) {
    return <HorizontalTileSelector firstTile={firstTile} lastTile={lastTile} puzzle={puzzle} />
  } else if (isVertical) {
    return <VerticalTileSelector puzzle={puzzle} firstTile={firstTile} lastTile={lastTile} />
  } else if (isDiagonal) {
    return <DiagonalTileSelector puzzle={puzzle} firstTile={firstTile} lastTile={lastTile} />
  }

  return (
    <SingleTileSelector puzzle={puzzle} firstTile={firstTile} lastTile={lastTile} />
  );
}

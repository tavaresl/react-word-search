import './BoardTileSelector.module.scss';
import {DetailedHTMLProps, HTMLAttributes} from "react";
import Puzzle, {PuzzleTile} from "@/models/Puzzle";
import HorizontalTileSelector from "@/components/HorizontalTileSelector";
import VerticalTileSelector from "@/components/VerticalTileSelector";
import DiagonalTileSelector from "@/components/DiagonalTileSelector";
import SingleTileSelector from "@/components/SingleTileSelector";

export type HexadecimalColor = `#${string}`;

export type BoardTileSelectorProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  puzzle: Puzzle,
  firstTile: PuzzleTile,
  lastTile: PuzzleTile,
  color: HexadecimalColor,
}

export default function BoardTileSelector({ puzzle, firstTile, lastTile, color, ...props }: BoardTileSelectorProps) {
  const dx = lastTile.x - firstTile.x;
  const dy = lastTile.y - firstTile.y;
  const isVertical = dx === 0 && dy !== 0;
  const isHorizontal = dx !== 0 && dy === 0;
  const isDiagonal = dx !== 0 && dy !== 0;

  if (isHorizontal) {
    return <HorizontalTileSelector color={color} firstTile={firstTile} lastTile={lastTile} puzzle={puzzle} />
  } else if (isVertical) {
    return <VerticalTileSelector color={color} puzzle={puzzle} firstTile={firstTile} lastTile={lastTile} />
  } else if (isDiagonal) {
    return <DiagonalTileSelector color={color} puzzle={puzzle} firstTile={firstTile} lastTile={lastTile} />
  }

  return (
    <SingleTileSelector color={color} puzzle={puzzle} firstTile={firstTile} lastTile={lastTile} />
  );
}

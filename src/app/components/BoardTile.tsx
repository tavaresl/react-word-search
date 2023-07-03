import './BoardTile.scss'
import React, { DetailedHTMLProps, HTMLAttributes, MouseEvent, MouseEventHandler, useState} from "react";

type BoardTileProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  selectable: boolean;
  selected: boolean;
}

export default function BoardTile({ selected, selectable, children, ...props }: BoardTileProps) {
    // const [classes, setClasses] = useState<string>('Board__Tile');

    const classes: string = selected ? 'Board__Tile Board__Tile--Selected' : 'Board__Tile';

    return (
      <div
        { ...props }
        className={ classes }>
        { children }
      </div>
    );
}
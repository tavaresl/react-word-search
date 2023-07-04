import styles from './BoardTile.module.scss'
import React, { DetailedHTMLProps, HTMLAttributes, MouseEvent, MouseEventHandler, useState} from "react";

type BoardTileProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  selectable: boolean;
  selected: boolean;
}

export default function BoardTile({ selected, selectable, children, ...props }: BoardTileProps) {
    // const [classes, setClasses] = useState<string>('Board__Tile');

    return (
      <div
        { ...props }
        className={ `${props.className} ${styles.BoardTile}` }>
        { children }
      </div>
    );
}
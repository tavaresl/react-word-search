export interface Vector {
  x: string;
  y: string;
}

export interface Rotation {
  angle: number;
}

export interface Transformation {
  position: Vector;
  dimension: Vector;
  rotation: Rotation;
}

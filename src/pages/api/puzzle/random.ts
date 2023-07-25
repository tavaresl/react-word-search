import '@/extensions/array';
import {constants} from "http2";
import {NextApiRequest, NextApiResponse} from "next";
import Puzzle, { Answer, Tile } from "@/models/Puzzle";
import { createPuzzle } from '@/services/puzzleCreator';

export default async function handle(req: NextApiRequest, res: NextApiResponse<Puzzle>) {
  const puzzle = await createPuzzle();

  if (puzzle === null) {
    res.status(constants.HTTP_STATUS_NOT_FOUND).end();
  } else {
    res.status(constants.HTTP_STATUS_OK).json(puzzle); 
  }
}

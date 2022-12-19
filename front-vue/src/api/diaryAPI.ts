import urbitAPI from "./urbitAPI";
import * as T from "@/types";
import * as D from "@/types/diary-types";

import { sigShip } from "@/helpers";

export function getNote(args: { host: T.Ship; found: string; noteID: string }) {
  return urbitAPI
    .scry({
      app: "diary",
      path: `/diary/${ args.host }/${ args.found }/notes/note/${ args.noteID }`,
    })
    .then((r) => {
      return r;
    });
}


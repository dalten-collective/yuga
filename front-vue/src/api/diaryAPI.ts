import urbitAPI from "./urbitAPI";
import * as T from "@/types";
import * as D from "@/types/diary-types";

import { sigShip, nowToUd } from "@/helpers";

const DIARY_ACTION_MARK = "diary-action-0";

export function getNote(args: {
  host: T.Ship;
  found: string;
  noteID: string;
}) {
  return urbitAPI
    .scry({
      app: "diary",
      path: `/diary/${args.host}/${args.found}/notes/note/${args.noteID}`,
    })
    .then((r) => {
      return r;
    });
}

export function createNote(args: {
  flag: T.Provider;
  author: T.Ship;
  title: string;
  content: string;
}) {
  const time = nowToUd();
  const { author, content, title, flag } = args;
  // TODO: return early if flag is malformed?
  const sent = Date.now();

  urbitAPI.poke({
    app: "diary",
    mark: DIARY_ACTION_MARK,
    json: {
      flag,
      update: {
        diff: {
          notes: {
            delta: {
              add: {
                author,
                content: [
                  {
                    inline: [
                      content,
                      {
                        break: null,
                      },
                    ],
                  },
                ],
                image: "",
                sent,
                title,
              },
            },
            time,
          },
        },
        time: "",
      },
    },
  });
}

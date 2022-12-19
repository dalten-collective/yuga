import urbitAPI from "./urbitAPI";
import * as T from "@/types";
import * as R from "@/types/rama-types";

const ONLY_MARK = "rama-only";

import { sigShip } from "@/helpers";

export function startWatching(host: T.Ship) {
  urbitAPI
    .poke({
      app: "rama",
      mark: ONLY_MARK,
      json: {
        watch: sigShip(host),
      },
    })
    .then((r) => {
      return r;
    });
}

export function joinFoundation(args: { who: T.Ship; fond: string; }) {
  urbitAPI
    .poke({
      app: "rama",
      mark: ONLY_MARK,
      json: {
        enter: {
          who: sigShip(args.who),
          fon: args.fond,
        }
      },
    })
    .then((r) => {
      return r;
    });
}

export function leaveFoundation(args: { who: T.Ship; fond: string; }) {
  urbitAPI
    .poke({
      app: "rama",
      mark: ONLY_MARK,
      json: {
        leave: {
          who: sigShip(args.who),
          fon: args.fond,
        }
      },
    })
    .then((r) => {
      return r;
    });
}

export function scryState(): R.InitialStateResponse {
  return urbitAPI
    .scry({
      app: "rama",
      path: "/state",
    })
    .then((r) => {
      return r;
    });
}

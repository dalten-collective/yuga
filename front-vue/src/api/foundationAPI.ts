import urbitAPI from "./urbitAPI";
const ADMIN_MARK = 'hari-seldon'
import * as T from '@/types';

export function createFoundation(
  prefix: string
) {
  urbitAPI.poke({
    app: 'hari',
    mark: ADMIN_MARK,
    json: {
      found: {
        fon: prefix
      },
    },
  }).then((r) => {
    return r
  })
}

export function addAlmoners(
  args: {
    prefix: T.FoundationName,
    ships: Array<T.Ship>,
  }
) {
  urbitAPI.poke({
    app: 'hari',
    mark: ADMIN_MARK,
    json: {
      "add-almoners": {
        fon: args.prefix,
        who: args.ships
      },
    },
  }).then((r) => {
    return r
  })
}

export function addJanitors(
  args: {
    prefix: T.FoundationName,
    ships: Array<T.Ship>,
  }
) {
  urbitAPI.poke({
    app: 'hari',
    mark: ADMIN_MARK,
    json: {
      "add-janitors": {
        fon: args.prefix,
        who: args.ships
      },
    },
  }).then((r) => {
    return r
  })
}

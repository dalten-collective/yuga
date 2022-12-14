import urbitAPI from "./urbitAPI";
import * as T from '@/types';

const ADMIN_MARK = 'hari-seldon'
const META_ADMIN_MARK = 'meta-admin'

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

export function removeAlmoners(
  args: {
    prefix: T.FoundationName,
    ships: Array<T.Ship>,
  }
) {
  urbitAPI.poke({
    app: 'hari',
    mark: ADMIN_MARK,
    json: {
      "del-almoners": {
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
export function removeJanitors(
  args: {
    prefix: T.FoundationName,
    ships: Array<T.Ship>,
  }
) {
  urbitAPI.poke({
    app: 'hari',
    mark: ADMIN_MARK,
    json: {
      "del-janitors": {
        fon: args.prefix,
        who: args.ships
      },
    },
  }).then((r) => {
    return r
  })
}

export function addTag(
  args: {
    prefix: T.FoundationName,
    tag: string,
  }
) {
  urbitAPI.poke({
    app: 'hari',
    mark: META_ADMIN_MARK,
    json: {
      "tag": {
        fon: args.prefix,
        tag: args.tag,
        wat: true
      },
    },
  }).then((r) => {
    return r
  })
}

export function addFolder(
  args: {
    prefix: T.FoundationName,
    folder: string,
  }
) {
  urbitAPI.poke({
    app: 'hari',
    mark: META_ADMIN_MARK,
    json: {
      "folder": {
        fon: args.prefix,
        folder: args.folder,
        wat: true
      },
    },
  }).then((r) => {
    return r
  })
}

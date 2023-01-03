import urbitAPI from "./urbitAPI";
import * as T from "@/types";
import * as R from "@/types/rama-types";
import { makePatDa } from '@urbit/api'

const RAMA_ONLY_MARK = "rama-only";
const HARI_RAMA_MARK = "hari-rama";
const HARI_SOMBER_MARK = "hari-somber";

import { sigShip } from "@/helpers";

export function startWatching(host: T.Ship) {
  urbitAPI
    .poke({
      app: "rama",
      mark: RAMA_ONLY_MARK,
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
      mark: RAMA_ONLY_MARK,
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
      mark: RAMA_ONLY_MARK,
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

export function moveToFolder(args: {
  foundation: T.FoundationName;
  who: T.Ship;
  folder: string;
  tags: Array<string>;
  post: D.PostOutlineWithID;
}) {
  const { who, foundation, folder, tags } = args
  const content = args.post.content
  const item = makePatDa(args.post.id)

  const fixNoteJson = {
    fon: foundation,
    item,
    ver: content,
    met: {
      fol: folder,
      tag: tags,
    }
  }

  urbitAPI
    .poke({
      app: "rama",
      mark: HARI_RAMA_MARK,
      json: {
        who,
        wat: {
          'fix-note': fixNoteJson
        }
      },
    })
    .then((r) => {
      return r;
    });
}

export function editNoteTags(args: {
  foundation: T.FoundationName;
  who: T.Ship;
  folder: string;
  tags: Array<string>;
  post: D.PostOutlineWithID;
}) {
  const { who, foundation, folder, tags } = args
  const content = args.post.content
  const item = makePatDa(args.post.id)

  const editTagJson = {
    fon: foundation,
    item,
    ver: content,
    met: {
      fol: folder,
      tag: tags,
    }
  }

  urbitAPI
    .poke({
      app: "rama",
      mark: HARI_RAMA_MARK,
      json: {
        who,
        wat: {
          'fix-note': editTagJson
        }
      },
    })
    .then((r) => {
      return r;
    });
}

export function addNote(args: {
  foundation: T.FoundationName;
  who: T.Ship;
  title: string;
  cover: string;
  folder: string;
  tags: Array<string>;
  content: string;
}) {
  const { who, foundation, title, cover, folder, tags, content } = args

  const addNoteJson = {
    fon: foundation,
    tit: title,
    cov: cover,
    ver: [
      { inline: [content] },
    ],
    met: {
      fol: folder,
      tag: tags,
    }
  }

  return urbitAPI.poke({
    app: "rama",
    mark: HARI_RAMA_MARK,
    json: {
      who,
      wat: {
        'add-note': addNoteJson,
      }
    }
  })
  .then((r) => {
    return r;
  });
}


//// scries

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

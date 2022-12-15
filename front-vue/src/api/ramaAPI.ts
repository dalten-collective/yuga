import urbitAPI from "./urbitAPI";
import * as T from '@/types';

const ONLY_MARK = 'rama-only'

import { sigShip } from '@/helpers'

export function startWatching (
  host: T.Ship
) {
  urbitAPI.poke({
    app: 'rama',
    mark: ONLY_MARK,
    json: {
      watch: sigShip(host)
    },
  }).then((r) => {
    return r
  })
}

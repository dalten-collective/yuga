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

// export function scryState () {
//   return urbitAPI.scry('state')
//     .then((r) => {
//       console.log('scry rama ', r)
//       return r
//     })
// }

import urbitAPI from "./urbitAPI";
const ADMIN_MARK = 'hari-seldon'

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

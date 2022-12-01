import { GetterTree } from 'vuex'
import { State } from './state'
import * as T from '@/types'

export type Getters = {
  foundationByProvider: (state: State) => (provider: string) => T.StateFoundation | null
}

export const getters: GetterTree<State, State> & Getters = {
  foundationByProvider: (state) => (provider): T.StateFoundation | null => {
    const f = state.foundations.find((f: T.StateFoundation) => f.foundation.provider === provider)
    if (f) {
      return f
    } else {
      return null
    }
  },
}

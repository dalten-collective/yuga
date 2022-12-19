import { GetterTree } from 'vuex'
import { GetterTypes } from './getter-types'
import { State } from './state'
import * as T from '@/types'
import * as R from '@/types/rama-types'

export type Getters = {
  [GetterTypes.FOUNDATION_BY_PROVIDER](state: State): (provider: string) => T.StateFoundation | null
  [GetterTypes.AGENT_SUBSCRIPTIONS](state: State): Array<T.AgentSubscription>
  [GetterTypes.HOST_BY_HOST](state: State): R.HostObject
}

export const getters: GetterTree<State, State> & Getters = {
  [GetterTypes.FOUNDATION_BY_PROVIDER]: (state) => (provider) => {
    const f = state.foundations.find((f: T.StateFoundation) => f.foundation.provider === provider)
    if (f) {
      return f
    } else {
      return null
    }
  },
  [GetterTypes.AGENT_SUBSCRIPTIONS]: (state): Array<T.AgentSubscription> | [] => {
    return state.subscriptions
  },
  [GetterTypes.HOST_BY_HOST]: (state) => (host: R.Host) => {
    const h = state.hosts.find((h: R.HostObject) => h.host === host)
    if (h) {
      return h
    } else {
      return null
    }
  },
}

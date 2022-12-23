import { GetterTree } from 'vuex'
import { GetterTypes } from './getter-types'
import { State } from './state'
import * as T from '@/types'
import * as R from '@/types/rama-types'
import * as D from '@/types/diary-types'

export type Getters = {
  [GetterTypes.FOUNDATION_BY_PROVIDER](state: State): (provider: string) => T.StateFoundation | null
  [GetterTypes.HOSTED_FOUNDATION_BY_PROVIDER](state: State): (provider: string) => R.SubFoundation | null
  [GetterTypes.AGENT_SUBSCRIPTIONS](state: State): Array<T.AgentSubscription>
  [GetterTypes.HOST_BY_HOST](state: State): R.HostObject | null
  [GetterTypes.POST_BY_ID](state: State): D.PostOutlineWithID
  [GetterTypes.HOSTED_FOLDERS_BY_PROVIDER](state: State): (provider: string) => Array<T.FoldersMeta> | []
  [GetterTypes.HOSTED_TAGS_BY_PROVIDER](state: State): (provider: string) => Array<T.TagsMeta> | []
}

export const getters: GetterTree<State, State> & Getters = {
  [GetterTypes.FOUNDATION_BY_PROVIDER]: (state) => (provider) => {
    const f: T.StateFoundation | undefined = state.foundations.find(f => f.foundation.provider === provider)

    if (f) {
      return f
    }
    return null
  },

  [GetterTypes.HOSTED_FOUNDATION_BY_PROVIDER]: (state) => (provider) => {
    const host = provider.split('/')[0]
    const foundationName = provider.split('/')[1]

    const hostObject: R.HostObject | undefined = state.hosts.find(ho => ho.host === host)

    if (hostObject) {
      const foundation: R.SubFoundation | undefined = hostObject.foundations.find(f => f.name === foundationName)
      if (foundation) {
        return foundation
      }
      return null
    }
    return null
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

  [GetterTypes.HOSTED_FOLDERS_BY_PROVIDER]: (state) => (provider: string): Array<T.FoldersMeta> | [] => {
    const host = provider.split('/')[0]
    const foundationName = provider.split('/')[1]

    const hostObject: R.HostObject | undefined = state.hosts.find(ho => ho.host === host)

    if (hostObject) {
      const foundation: R.SubFoundation | undefined = hostObject.foundations.find(f => f.name === foundationName)
      if (foundation) {
        return foundation.details.metadata.folders
      }
      return []
    }
    return []
  },

  [GetterTypes.HOSTED_TAGS_BY_PROVIDER]: (state) => (provider: string): Array<T.TagsMeta> | [] => {
    const host = provider.split('/')[0]
    const foundationName = provider.split('/')[1]

    const hostObject: R.HostObject | undefined = state.hosts.find(ho => ho.host === host)

    if (hostObject) {
      const foundation: R.SubFoundation | undefined = hostObject.foundations.find(f => f.name === foundationName)
      if (foundation) {
        return foundation.details.metadata.tags
      }
      return []
    }
    return []
  },
}

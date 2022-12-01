import { ActionTree, ActionContext } from 'vuex'
import { State } from './state'
import { Mutations } from './mutations';
import { ActionTypes } from './action-types';
import { MutationTypes } from './mutation-types';
import * as T from "@/types";

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>
} & Omit<ActionContext<State, State>, 'commit'>

export interface Actions {
  [ActionTypes.FOUNDATION_SET](
    { commit }: AugmentedActionContext,
    payload: Array<T.StateFoundation>
  ): void
  [ActionTypes.FOUNDATION_ADD](
    { commit }: AugmentedActionContext,
    payload: T.FoundationWithName
  ): void
}

export const actions: ActionTree<State, State> & Actions = {
  [ActionTypes.FOUNDATION_SET]({ commit }, foundations: Array<T.StateFoundation>) {
    // TODO: return promises for pokes...
    commit(MutationTypes.FOUNDATIONS_SET, foundations)
  },
  [ActionTypes.FOUNDATION_ADD]({ commit }, foundation: T.FoundationWithName) {
    commit(MutationTypes.FOUNDATIONS_ADD, foundation)
  },
}


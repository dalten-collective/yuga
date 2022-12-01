import { MutationTree } from "vuex";
import { MutationTypes } from "./mutation-types";
import { State } from "./state";
import * as T from "@/types";

export type Mutations<S = State> = {
  [MutationTypes.FOUNDATIONS_SET](
    state: S,
    payload: Array<T.StateFoundation>
  ): void;
  [MutationTypes.FOUNDATIONS_ADD](
    state: S,
    payload: T.Foundation
  ): void;
  [MutationTypes.SUBSCRIPTION_ADD](
    state: S,
    payload: T.AgentSubscription
  ): void;
  [MutationTypes.SUBSCRIPTION_REMOVE](
    state: S,
    payload: T.AgentSubscription
  ): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.FOUNDATIONS_SET](
    state,
    payload: Array<T.StateFoundation>
  ) {
    state.foundations = payload;
  },
  [MutationTypes.FOUNDATIONS_ADD](state, payload: T.Foundation) {
    state.foundations = state.foundations.concat(payload);
  },
  [MutationTypes.SUBSCRIPTION_ADD](
    state,
    payload: T.AgentSubscription
  ) {
    state.subscriptions.push(payload);
  },
  [MutationTypes.SUBSCRIPTION_REMOVE](
    state,
    payload: T.AgentSubscription
  ) {
    const sub = state.subscriptions.find((s) => s === payload);
    state.subscriptions = state.subscriptions.filter((s) => s != sub);
  },
};

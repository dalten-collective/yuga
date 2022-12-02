import { MutationTree } from "vuex";
import { MutationTypes } from "./mutation-types";
import { State } from "./state";
import * as T from "@/types";
import { sigShip } from "@/helpers"

export type Mutations<S = State> = {
  [MutationTypes.FOUNDATIONS_SET](
    state: S,
    payload: Array<T.StateFoundation>
  ): void;
  [MutationTypes.FOUNDATIONS_ADD](
    state: S,
    payload: T.StateFoundation
  ): void;

  [MutationTypes.ALMONERS_ADD](
    state: S,
    payload: T.NameAndAlmoners
  ): void;

  [MutationTypes.JANITORS_ADD](
    state: S,
    payload: T.NameAndJanitors
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
  [MutationTypes.FOUNDATIONS_ADD](state, payload: T.StateFoundation) {
    state.foundations = state.foundations.concat(payload);
  },

  [MutationTypes.ALMONERS_ADD](state, payload: T.NameAndAlmoners) {
    const haveFoundation = state.foundations.find((sf: T.StateFoundation) => {
      return sf.name === payload.name
    })
    if (!haveFoundation) {
      return
    }

    haveFoundation.foundation.almoners.push(...payload.almoners.map(ship => sigShip(ship)))
  },

  [MutationTypes.JANITORS_ADD](state, payload: T.NameAndJanitors) {
    const haveFoundation = state.foundations.find((sf: T.StateFoundation) => {
      return sf.name === payload.name
    })
    if (!haveFoundation) {
      return
    }

    haveFoundation.foundation.janitors.push(...payload.janitors.map(ship => sigShip(ship)))
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

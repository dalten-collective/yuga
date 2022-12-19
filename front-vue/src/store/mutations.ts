import { MutationTree } from "vuex";
import { MutationTypes } from "./mutation-types";
import { State } from "./state";
import * as T from "@/types";
import * as R from "@/rama-types";
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
  [MutationTypes.ALMONERS_REM](
    state: S,
    payload: T.NameAndAlmoners
  ): void;

  [MutationTypes.JANITORS_ADD](
    state: S,
    payload: T.NameAndJanitors
  ): void;

  [MutationTypes.TAG_ADD](
    state: S,
    payload: T.NameAndTag
  ): void;

  [MutationTypes.SUBSCRIPTION_ADD](
    state: S,
    payload: T.AgentSubscription
  ): void;
  [MutationTypes.SUBSCRIPTION_REMOVE](
    state: S,
    payload: T.AgentSubscription | null
  ): void;

  [MutationTypes.HOSTS_SET](
    state: S,
    payload: Array<R.HostObject>
  ): void;
  [MutationTypes.HOSTS_ADD](
    state: S,
    payload: Array<R.HostObject>
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
  [MutationTypes.ALMONERS_REM](state, payload: T.NameAndAlmoners) {
    const haveFoundation = state.foundations.find((sf: T.StateFoundation) => {
      return sf.name === payload.name
    })
    if (!haveFoundation) {
      return
    }

    haveFoundation.foundation.almoners = haveFoundation.foundation.almoners.filter((exist: T.Ship) => {
      return !payload.almoners.map((a: T.Ship) => sigShip(a)).includes(sigShip(exist))
    })
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
  [MutationTypes.JANITORS_REM](state, payload: T.NameAndJanitors) {
    const haveFoundation = state.foundations.find((sf: T.StateFoundation) => {
      return sf.name === payload.name
    })
    if (!haveFoundation) {
      return
    }

    haveFoundation.foundation.janitors = haveFoundation.foundation.janitors.filter((exist: T.Ship) => {
      return !payload.janitors.map((a: T.Ship) => sigShip(a)).includes(sigShip(exist))
    })
  },

  [MutationTypes.TAG_ADD](state, payload: T.NameAndTag) {
    const haveFoundation = state.foundations.find((sf: T.StateFoundation) => {
      return sf.name === payload.foundation
    })
    if (!haveFoundation) {
      return
    }

    const tagWithPosts = {
      tag: payload.tag,
      posts: []
    }
    haveFoundation.foundation.metadata.public.tags.push(tagWithPosts)
  },

  [MutationTypes.FOLDER_ADD](state, payload: T.NameAndFolder) {
    const haveFoundation = state.foundations.find((sf: T.StateFoundation) => {
      return sf.name === payload.foundation
    })
    if (!haveFoundation) {
      return
    }

    const folderWithPosts = {
      folder: payload.folder,
      posts: []
    }
    haveFoundation.foundation.metadata.public.folders.push(folderWithPosts)
  },

  [MutationTypes.SUBSCRIPTION_ADD](
    state,
    payload: T.AgentSubscription
  ) {
    state.subscriptions.push(payload)
  },

  [MutationTypes.SUBSCRIPTION_REMOVE](
    state,
    payload: T.AgentSubscription | null
  ) {
    if (payload === null) {
      state.subscriptions = []
    } else {
      const sub = state.subscriptions.find((s) => s === payload);
      state.subscriptions = state.subscriptions.filter((s) => s != sub);
    }
  },

  [MutationTypes.HOSTS_SET](
    state,
    payload: Array<R.HostObject>
  ) {
    state.hosts = payload
  },
  [MutationTypes.HOSTS_ADD](
    state,
    payload: Array<R.HostObject>
  ) {
    // TODO: check for dupes / use a Set
    state.hosts.push(payload)
  },
};

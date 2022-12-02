import { ActionTree, ActionContext, DispatchOptions } from "vuex";
import { State } from "./state";
import { Getters } from "./getters";
import { Mutations } from "./mutations";
import { ActionTypes } from "./action-types";
import { MutationTypes } from "./mutation-types";
import * as T from "@/types";
import airlock from "@/api";

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>;
  };
  dispatch<K extends keyof Actions>(
    key: K,
    payload?: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>;
} & Omit<ActionContext<State, State>, "commit">;

export interface Actions {
  [ActionTypes.AIRLOCK_OPEN](
    { commit }: AugmentedActionContext,
    payload: string
  ): void;
  [ActionTypes.AIRLOCK_CLOSE](
    { commit, getters }: AugmentedActionContext
  ): void;
  [ActionTypes.SUBSCRIPTION_ADD](
    { commit }: AugmentedActionContext,
    payload: T.AgentSubscription
  ): void;

  [ActionTypes.FOUNDATION_SET](
    { commit }: AugmentedActionContext,
    payload: Array<T.StateFoundation>
  ): void;
  [ActionTypes.FOUNDATION_ADD](
    { commit }: AugmentedActionContext,
    payload: T.FoundationWithName
  ): void;

  [ActionTypes.ALMONERS_ADD](
    { commit }: AugmentedActionContext,
    payload: T.NameAndAlmoners
  ): void;

  [ActionTypes.JANITORS_ADD](
    { commit }: AugmentedActionContext,
    payload: T.NameAndJanitors
  ): void;
}

export const actions: ActionTree<State, State> & Actions = {
  [ActionTypes.AIRLOCK_OPEN]({ commit, dispatch }, payload: string) {
    const agentName = payload;
    airlock.openAirlockTo(
      agentName,

      // Main all-responses-handler
      (data: T.GallResponse) => {
        console.log("agentName ", agentName);
        console.log("response ", data);
        if (T.IsInitialStateResponse(data)) {
          dispatch(ActionTypes.FOUNDATION_SET, data.put.foundations as Array<T.StateFoundation>);
        }
        if (T.IsAddFoundationResponse(data)) {
          dispatch(ActionTypes.FOUNDATION_ADD, data.add as T.FoundationWithName);
        }
        if (T.IsAddAlmonersResponse(data)) {
          dispatch(ActionTypes.ALMONERS_ADD, data.add as T.NameAndAlmoners)
        }

        if (T.IsAddJanitorsResponse(data)) {
          dispatch(ActionTypes.JANITORS_ADD, data.add as T.NameAndJanitors)
        }
      },

      (subscriptionNumber: number) => {
        console.log("got subscription number ", subscriptionNumber);
        dispatch(ActionTypes.SUBSCRIPTION_ADD, {
          agentName,
          subscriptionNumber,
        } as T.AgentSubscription);
      }
    );
  },

  [ActionTypes.AIRLOCK_CLOSE]( { commit, getters }) {
    const agentSubscriptions: Array<T.AgentSubscription> | [] =
      getters.agentSubscriptions;
    agentSubscriptions.forEach((sub) => {
      airlock.closeAirlock(sub.subscriptionNumber, [
        commit(MutationTypes.SUBSCRIPTION_REMOVE, sub),
      ]);
    });
  },

  //// Subscriptions

  [ActionTypes.SUBSCRIPTION_ADD](
    { state, commit, dispatch },
    payload: T.AgentSubscription
  ) {
    const existing:
      | Array<T.AgentSubscription>
      | [] = state.subscriptions.filter((s: T.AgentSubscription) => {
      return s.agentName === payload.agentName;
    });
    existing.forEach((sub) => {
      dispatch(ActionTypes.SUBSCRIPTION_REMOVE, sub);
    });
    commit(MutationTypes.SUBSCRIPTION_REMOVE, payload);
  },

  //// Foundations

  [ActionTypes.FOUNDATION_SET](
    { commit },
    foundations: Array<T.StateFoundation>
  ) {
    // TODO: return promises for pokes...
    commit(MutationTypes.FOUNDATIONS_SET, foundations);
  },
  [ActionTypes.FOUNDATION_ADD](
    { commit },
    foundation: T.FoundationWithName
  ) {
    let temp = foundation
    let foundName = temp.name
    let {name, ...otherFields} = temp
    let newFoundation: T.Foundation = temp
    const toAdd = {
      foundation: newFoundation,
      name: foundName
    } as T.StateFoundation
    commit(MutationTypes.FOUNDATIONS_ADD, toAdd)
  },

  //// Almoners

  [ActionTypes.ALMONERS_ADD](
    { commit },
    payload: T.NameAndAlmoners
  ) {
    commit(MutationTypes.ALMONERS_ADD, payload)
  },

  //// Janitors

  [ActionTypes.JANITORS_ADD](
    { commit },
    payload: T.NameAndJanitors
  ) {
    commit(MutationTypes.JANITORS_ADD, payload)
  },
};

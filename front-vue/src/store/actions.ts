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
}

export const actions: ActionTree<State, State> & Actions = {
  [ActionTypes.AIRLOCK_CLOSE]( { commit, getters }) {
    const agentSubscriptions: Array<T.AgentSubscription> | [] =
      getters.agentSubscriptions;
    agentSubscriptions.forEach((sub) => {
      airlock.closeAirlock(sub.subscriptionNumber, [
        commit(MutationTypes.SUBSCRIPTION_REMOVE, sub),
      ]);
    });
  },
  [ActionTypes.AIRLOCK_OPEN]({ commit, dispatch }, payload: string) {
    const agentName = payload;
    airlock.openAirlockTo(
      agentName,
      (data: T.GallResponse) => {
        console.log("agentName ", agentName);
        console.log("response ", data);
        if (T.IsInitialStateResponse(data)) {
          dispatch(ActionTypes.FOUNDATION_SET, data.put.foundations);
        }
        if (T.IsAddFoundationResponse(data)) {
          dispatch(ActionTypes.FOUNDATION_ADD, data.add);
        }
        //if (T.IsAddAlmonersResponse(data)) {
        //  ctx.dispatch("foundationStore/addAlmoners", data.add as T.NameAndAlmoners, { root: true })
        //}
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
    commit(MutationTypes.FOUNDATIONS_ADD, foundation);
  },
};

import { ActionTree, ActionContext, DispatchOptions } from "vuex";
import { State } from "./state";
import { Getters } from "./getters";
import { Mutations } from "./mutations";
import { ActionTypes } from "./action-types";
import { MutationTypes } from "./mutation-types";
import * as T from "@/types";
import * as R from "@/types/rama-types";
import airlock from "@/api";
import ramaAPI from "@/api";

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
    { commit, getters }: AugmentedActionContext,
    payload: T.AgentSubscription | null
  ): void;
  [ActionTypes.SUBSCRIPTION_ADD](
    { commit }: AugmentedActionContext,
    payload: T.AgentSubscription
  ): void;
  // [ActionTypes.SUBSCRIPTION_REMOVE](
  //   { commit }: AugmentedActionContext,
  //   payload: T.AgentSubscription
  // ): void;

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

  [ActionTypes.TAG_ADD](
    { commit }: AugmentedActionContext,
    payload: T.NameAndTag
  ): void;
}

export const actions: ActionTree<State, State> & Actions = {
  [ActionTypes.AIRLOCK_OPEN]({ commit, dispatch }, payload: string) {
    const agentName = payload;
    airlock.openAirlockTo(
      agentName,

      // Main all-responses-handler
      (data: T.GallResponse | R.GallResponse) => {
        console.log('gall response ', data)
        console.log("agentName ", agentName);

        if (agentName === 'hari') {
          console.log("hari response ", data);
          if (T.IsInitialStateResponse(data)) {
            dispatch(ActionTypes.FOUNDATION_SET, data.put.foundations as Array<T.StateFoundation>);
          }
          if (T.IsAddFoundationResponse(data)) {
            dispatch(ActionTypes.FOUNDATION_ADD, data.add as T.FoundationWithName);
          }

          if (T.IsAddAlmonersResponse(data)) {
            dispatch(ActionTypes.ALMONERS_ADD, data.add as T.NameAndAlmoners)
          }
          if (T.IsRemAlmonerResponse(data)) {
            dispatch(ActionTypes.ALMONERS_REM, data.rem as T.NameAndAlmoners)
          }

          if (T.IsAddJanitorsResponse(data)) {
            dispatch(ActionTypes.JANITORS_ADD, data.add as T.NameAndJanitors)
          }
          if (T.IsRemJanitorResponse(data)) {
            dispatch(ActionTypes.JANITORS_REM, data.rem as T.NameAndJanitors)
          }

          if (T.IsAddTagResponse(data)) {
            dispatch(ActionTypes.TAG_ADD, data.add as T.NameAndTag)
          }

          if (T.IsAddFolderResponse(data)) {
            dispatch(ActionTypes.FOLDER_ADD, data.add as T.NameAndFolder)
          }
        }

        if (agentName === 'rama') {
          console.log("rama response ", data);
          // TODO: going to ignore sub responses for Rama for now
          // if (R.IsInitialStateResponse(data)) {
          //   dispatch(ActionTypes.HOSTS_SET, data.put.hosts as Array<R.HostObject>)
          // }

          // TODO: going to ignore sub responses for Rama for now
          // if (R.IsAddJanitorsResponse(data)) {
          //   console.log('got jan add ', data)
          //   // dispatch(ActionTypes.HOSTS_SET, data.put.hosts as Array<R.HostObject>)
          // }
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

  [ActionTypes.AIRLOCK_CLOSE](
    { commit, getters },
    sub: T.AgentSubscription | null
  ) {
    console.log('closing airlock ', sub)
    if (sub) {
      const agentSubscriptions: Array<T.AgentSubscription> | [] =
        getters.agentSubscriptions;
      agentSubscriptions.forEach((sub) => {
        airlock.closeAirlock(sub.subscriptionNumber, [
          commit(MutationTypes.SUBSCRIPTION_REMOVE, sub)
        ]);
      });
    } else {
      commit(MutationTypes.SUBSCRIPTION_REMOVE, null)
    }
  },

  //// Explore

  ////// Scries

  [ActionTypes.RAMA_SCRY_STATE]({ dispatch }) {
    ramaAPI.scryState().then((data: R.InitialStateResponse) => {
      console.log('rrrrr ', data)
      dispatch(ActionTypes.HOSTS_SET, data.put.hosts as Array<R.HostObject>)
      dispatch(ActionTypes.SAVED_SET, data.put.saved as Array<R.Saved>)
    })
  },

  ////// Hosts

  [ActionTypes.HOSTS_SET](
    { state, commit, dispatch },
    payload: Array<R.HostObject>
  ) {
    commit(MutationTypes.HOSTS_SET, payload);
  },
  [ActionTypes.HOSTS_ADD](
    { state, commit, dispatch },
    payload: Array<R.HostObject>
  ) {
    console.log('hosts ', payload)
    commit(MutationTypes.HOSTS_ADD, payload);
  },

  ////// Saved

  [ActionTypes.SAVED_SET](
    { state, commit, dispatch },
    payload: Array<R.Saved>
  ) {
    commit(MutationTypes.SAVED_SET, payload);
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
    // TODO: not sure sub handling is done right / nor matters, though.
    // existing.forEach((sub) => {
    //   dispatch(ActionTypes.SUBSCRIPTION_REMOVE, sub);
    // });
    commit(MutationTypes.SUBSCRIPTION_ADD, payload);
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
  [ActionTypes.ALMONERS_REM](
    { commit },
    payload: T.NameAndAlmoners
  ) {
    commit(MutationTypes.ALMONERS_REM, payload)
  },

  //// Janitors

  [ActionTypes.JANITORS_ADD](
    { commit },
    payload: T.NameAndJanitors
  ) {
    commit(MutationTypes.JANITORS_ADD, payload)
  },
  [ActionTypes.JANITORS_REM](
    { commit },
    payload: T.NameAndAlmoners
  ) {
    commit(MutationTypes.JANITORS_REM, payload)
  },

  //// Tags

  [ActionTypes.TAG_ADD](
    { commit },
    payload: T.NameAndTag
  ) {
    commit(MutationTypes.TAG_ADD, payload)
  },

  //// Folders

  [ActionTypes.FOLDER_ADD](
    { commit },
    payload: T.NameAndFolder
  ) {
    commit(MutationTypes.FOLDER_ADD, payload)
  },
};

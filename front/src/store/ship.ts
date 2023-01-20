import airlock from "../api";

import * as T from "@/types"

export default {
  namespaced: true,
  state() {
    return {
      subscriptions: [] as Array<T.AgentSubscription>,
    };
  },

  getters: {
    agentSubscriptions(state): Array<T.AgentSubscription> | [] {
      return state.subscriptions
    },
  },

  mutations: {
    addSubscription(state, payload: T.AgentSubscription) {
      state.subscriptions.push(payload);
    },

    unsetSubscription(state, subscription: T.AgentSubscription) {
      const sub = state.subscriptions.find((s) => s === subscription);
      state.subscriptions = state.subscriptions.filter((s) => s != sub);
    },
  },

  actions: {
    openAirlockToAgent(ctx, agentName: string) {
      airlock.openAirlockTo(
        agentName,
        (data: T.GallResponse) => {
          console.log("agentName ", agentName);
          console.log("response ", data);
          if (T.IsInitialStateResponse(data)) {
            ctx.dispatch("foundationStore/setFoundations", data.put.foundations, { root: true })
          }
          if (T.IsAddFoundationResponse(data)) {
            ctx.dispatch("foundationStore/addFoundation", data.add, { root: true })
          }
          if (T.IsAddAlmonersResponse(data)) {
            ctx.dispatch("foundationStore/addAlmoners", data.add as T.NameAndAlmoners, { root: true })
          }
        },
        (subscriptionNumber: number) => {
          console.log("got subscription number ", subscriptionNumber);
          ctx.dispatch("addSubscription", {
            agentName,
            subscriptionNumber,
          } as T.AgentSubscription);
        }
      );
    },

    removeSubscription({ commit }, subscription: T.AgentSubscription) {
      commit("unsetSubscription", subscription);
    },

    addSubscription({ state, commit, dispatch }, payload: T.AgentSubscription) {
      const existing:
        | Array<T.AgentSubscription>
        | [] = state.subscriptions.filter((s: T.AgentSubscription) => {
        return s.agentName === payload.agentName;
      });
      existing.forEach((sub) => {
        dispatch("removeSubscription", sub);
      });
      commit("addSubscription", payload);
    },

    closeAgentAirlocks({ commit, getters }) {
      const agentSubscriptions: Array<T.AgentSubscription> | [] =
        getters.agentSubscriptions;
      agentSubscriptions.forEach((sub) => {
        airlock.closeAirlock(sub.subscriptionNumber, [
          commit("unsetSubscription", sub),
        ]);
      });
    },
  },
};

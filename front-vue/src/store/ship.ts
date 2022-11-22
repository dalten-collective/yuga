import airlock from "../api";

import {
  AgentSubscription, InitialStateResponse,
} from "@/types";

export default {
  namespaced: true,
  state() {
    return {
      subscriptions: [] as Array<AgentSubscription>,
    };
  },

  getters: {
    agentSubscriptions(state): Array<AgentSubscription> | [] {
      return state.subscriptions
    },
  },

  mutations: {
    addSubscription(state, payload: AgentSubscription) {
      state.subscriptions.push(payload);
    },

    unsetSubscription(state, subscription: AgentSubscription) {
      const sub = state.subscriptions.find((s) => s === subscription);
      state.subscriptions = state.subscriptions.filter((s) => s != sub);
    },
  },

  actions: {
    openAirlockToAgent(ctx, agentName: string) {
      airlock.openAirlockTo(
        agentName,
        (data: InitialStateResponse) => {
          console.log("agentName ", agentName);
          console.log("response ", data);
          if ('put' in data) {
            ctx.dispatch("foundationStore/setFoundations", data.put.foundations, { root: true })
          }
        },
        (subscriptionNumber: number) => {
          console.log("got subscription number ", subscriptionNumber);
          ctx.dispatch("addSubscription", {
            agentName,
            subscriptionNumber,
          } as AgentSubscription);
        }
      );
    },

    removeSubscription({ commit }, subscription: AgentSubscription) {
      commit("unsetSubscription", subscription);
    },

    addSubscription({ state, commit, dispatch }, payload: AgentSubscription) {
      const existing:
        | Array<AgentSubscription>
        | [] = state.subscriptions.filter((s: AgentSubscription) => {
        return s.agentName === payload.agentName;
      });
      existing.forEach((sub) => {
        dispatch("removeSubscription", sub);
      });
      commit("addSubscription", payload);
    },

    closeAgentAirlocks({ commit, getters }) {
      const agentSubscriptions: Array<AgentSubscription> | [] =
        getters.agentSubscriptions;
      agentSubscriptions.forEach((sub) => {
        airlock.closeAirlock(sub.subscriptionNumber, [
          commit("unsetSubscription", sub),
        ]);
      });
    },
  },
};

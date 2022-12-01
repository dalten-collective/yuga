import * as foundationAPI from "@/api/foundationAPI";
import * as T from "@/types";

export default {
  namespaced: true,
  state() {
    return {
      foundations: [] as Array<T.StateFoundation>,
    };
  },

  getters: {
    foundationByProvider: (state) => (provider: string): T.Foundation | null => {
      return state.foundations.find((f: T.StateFoundation) => f.foundation.provider === provider)
    },
  },

  mutations: {
    setFoundations(state, foundations: Array<T.StateFoundation>) {
      state.foundations = foundations;
    },
    addFoundation(state, foundation: T.Foundation) {
      state.foundations = state.foundations.concat(foundation)
    },
  },

  actions: {
    setFoundations(ctx, foundations: Array<T.StateFoundation>) {
      ctx.commit("setFoundations", foundations)
    },
    addFoundation(ctx, foundation: T.FoundationWithName) {
      console.log('adding new ', foundation)
      let temp = foundation
      let foundName = temp.name
      let {name, ...otherFields} = temp
      let newFoundation: T.Foundation = temp
      const toAdd = {
        foundation: newFoundation,
        name: foundName
      }
      ctx.commit("addFoundation", toAdd)
    },

    addAlmoners(ctx, payload: T.NameAndAlmoners) {
    },

  },
};

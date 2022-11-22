import * as foundationAPI from "@/api/foundationAPI";

import * as T from "@/types";

export default {
  namespaced: true,
  state() {
    return {
      foundations: [] as Array<{ foundation: T.Foundation; name: string; }>,
    };
  },

  getters: {
    foundationByProvider: (state) => (provider: string): T.Foundation | null => {
      return state.foundations.find((f: T.Foundation) => f.foundation.provider === provider)
    },
  },

  mutations: {
    setFoundations(state, foundations: Array<T.Foundation>) {
      state.foundations = foundations;
    },
  },

  actions: {
    setFoundations(ctx, foundations: Array<T.Foundation>) {
      ctx.commit("setFoundations", foundations)
    },

  },
};

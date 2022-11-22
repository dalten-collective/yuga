import { createStore as createVuexStore } from "vuex";

import ship from "./ship";
import foundationStore from "./foundationStore";

export const createStore = () => {
  return createVuexStore({
    modules: {
      ship,
      foundationStore,
    },
  });
};

import * as T from "@/types";
import * as R from "@/types/rama-types";
import * as L from "@/types/loading-types";

import { loaderStates } from "@/types/loading-types";

const uiElementLoadingState: L.UILoaderState = {
  foundationListHost: loaderStates.initial,
  foundationCreate: loaderStates.initial,
  foundationSubscribe: loaderStates.initial,
  ramaListFoundations: loaderStates.initial,
}

export const state = {
  foundations: [] as Array<T.StateFoundation>,
  subscriptions: [] as Array<T.AgentSubscription>,
  hosts: [] as Array<R.HostObject>,
  saved: [] as Array<R.Saved>,
  share: false as boolean,
  loadingStates: uiElementLoadingState as L.UILoaderState,
}

export type State = typeof state

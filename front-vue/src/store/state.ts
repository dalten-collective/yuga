import * as T from "@/types";

export const state = {
  foundations: [] as Array<T.StateFoundation>,
  subscriptions: [] as Array<T.AgentSubscription>,
}

export type State = typeof state

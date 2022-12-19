import * as T from "@/types";
import * as R from "@/types/rama-types";

export const state = {
  foundations: [] as Array<T.StateFoundation>,
  subscriptions: [] as Array<T.AgentSubscription>,
  hosts: [] as Array<R.HostObject>,
  saved: [] as Array<R.Saved>,
  share: false as boolean,
}

export type State = typeof state

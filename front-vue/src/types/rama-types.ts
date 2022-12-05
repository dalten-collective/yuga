import * as T from './index';

export type Host = T.Ship;
export interface SubFoundation {
  name: string;
  subscribed: boolean;
  details: T.Metadata["public"]
}

export interface Saved {
  key: string;
  added: number;
  provider: T.Provider;
  id: string;
  "post-time": number;
}

export interface InitialStateResponse {
  put: {
    hosts: { // TODO: double-nested in the dejs
      hosts: Array<T.Ship>;
    };
    saved: Array<Saved>;
    share: boolean;
  }
}

export type GallResponse = InitialStateResponse

export const IsInitialStateResponse = (r: GallResponse):
  r is InitialStateResponse => {
  return ('put' in r) && ('hosts' in r.put)
}

import * as T from './index';

export type Host = T.Ship;

export interface SubFoundation {
  name: string;
  subscribed: boolean;
  details: T.Metadata["public"]
}

export interface HostObject {
  host: Host;
  foundations: Array<SubFoundation>;
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
    hosts: Array<HostObject>;
    saved: Array<Saved>;
    share: boolean;
  }
}

export interface AddJanitorsResponse {
  add: {
    host: Host;
    janitors: Array<T.Ship>;
    name: string;
  }
}

export type GallResponse = InitialStateResponse | AddJanitorsResponse

export const IsInitialStateResponse = (r: GallResponse):
  r is InitialStateResponse => {
  return ('put' in r) && (('hosts' in r.put) && ('saved' in r.put) && ('share' in r.put))
}

export const IsAddJanitorsResponse = (r: GallResponse):
  r is AddJanitorsResponse => {
  return ('add' in r) && (('janitors' in r.add))
}

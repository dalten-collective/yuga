import * as T from './index';

export type Host = T.Ship;

export interface SubFoundation {
  name: string;
  subscribed: boolean;
  details: {
    metadata: Metadata;
  }
}

export interface Metadata {
  authors: Array<AuthorsMeta>;
  folders: Array<FoldersMeta>;
  tags: Array<TagsMeta>;
}

export interface AuthorsMeta {
  author: string;
  posts: Array<RamaPost>;
}
export interface FoldersMeta {
  folder: string;
  posts: Array<RamaPost>;
}
export interface TagsMeta {
  tag: string;
  posts: Array<RamaPost>;
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

export interface RamaPost {
  "post-time": number;
  id: string;
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

export interface AddHostResponse {
  add: {
    host: Host;
    janitors: Array<T.Ship>;
    name: string;
  }
}

export type ChangeHostResponse = Array<
  {
    foundations: Array<any>;
    host: T.Ship
  }
>

export type GallResponse = InitialStateResponse | AddJanitorsResponse | ChangeHostResponse

export const IsInitialStateResponse = (r: GallResponse):
  r is InitialStateResponse => {
  return ('put' in r) && (('hosts' in r.put) && ('saved' in r.put) && ('share' in r.put))
}

export const IsAddJanitorsResponse = (r: GallResponse):
  r is AddJanitorsResponse => {
  return ('add' in r) && (('janitors' in r.add))
}

export const IsHostAddResponse = (r: GallResponse):
  r is AddHostResponse => {
  return ('add' in r) && (('host' in r.add) && ('name' in r.add))
}

export const IsHostSubscribeChange = (r: GallResponse):
  r is ChangeHostResponse => {
    return (Array.isArray(r) && (r.length > 0 && ('host' in r[0] && 'foundations' in r[0]))) ||
      (('put' in r) && (('hosts' in r.put) && ('host' in r.put.hosts) && ('subscribed' in r.put.hosts)))
}

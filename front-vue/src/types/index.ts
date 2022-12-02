export interface AgentSubscription {
  agentName: string;
  subscriptionNumber: number;
};

export type Ship = `~${ string }` | null
export type FoundationName = string
export type Provider = `${ Ship }/${ FoundationName }`

export interface Metadata {
  public: {
    authors: Array<string>;
    folders: Array<string>;
    tags:    Array<string>;
    views:   Array<any>;    // TODO
  }
  secret: {
    "proposed-tags": Array<any>; // TODO
    "unique-views":  Array<any>; // TODO
  }
}

export interface Foundation {
  provider: Provider;
  metadata: Metadata;
  almoners: Array<any>; // TODO
  janitors: Array<any>; // TODO
}

export interface StateFoundation {
  foundation: Foundation;
  name: FoundationName;
}

export interface FoundationWithName {
  provider: Provider;
  metadata: Metadata;
  almoners: Array<any>; // TODO
  janitors: Array<any>; // TODO
  name?: FoundationName;
}

//// Response types

export interface InitialStateResponse {
  put: {
    foundations: Array<StateFoundation>
  }
}

export interface AddFoundationResponse {
  add: FoundationWithName
}

export interface NameAndAlmoners {
  name: FoundationName;
  almoners: Array<Ship>;
}

export interface AddAlmonersResponse {
  add: NameAndAlmoners;
}

export interface NameAndJanitors {
  name: FoundationName;
  janitors: Array<Ship>;
}

export interface AddJanitorsResponse {
  add: NameAndJanitors;
}

// Response identifiers

export type GallResponse = InitialStateResponse | AddFoundationResponse | AddAlmonersResponse | AddJanitorsResponse

export const IsInitialStateResponse = (r: GallResponse):
  r is InitialStateResponse => {
  return ('put' in r)
}

export const IsAddFoundationResponse = (r: GallResponse):
r is AddFoundationResponse => {
  return (('add' in r) && ('metadata' in r.add))
}

export const IsAddAlmonersResponse = (r: GallResponse):
r is AddAlmonersResponse => {
  return (('add' in r) && 'almoners' in r.add)
}

export const IsAddJanitorsResponse = (r: GallResponse):
r is AddJanitorsResponse => {
  return (('add' in r) && 'janitors' in r.add)
}

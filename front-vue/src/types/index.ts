export type Ship = `~${ string }`
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

//// Responses

export interface InitialStateResponse {
  put: {
    foundations: Array<{
      foundation: Foundation;
      name: FoundationName
    }>
  }
}

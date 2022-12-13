export interface AgentSubscription {
  agentName: string;
  subscriptionNumber: number;
};

export type Ship = `~${ string }` | null
export type FoundationName = string
export type Provider = `${ Ship }/${ FoundationName }`

export type Post = string;  // TODO:

export type AuthorsMeta = Array<{
  author: Ship;
  posts: Array<Post>;
}>
export type FoldersMeta = Array<{
  folder: string;
  posts: Array<Post>;
}>
export type TagsMeta = Array<{
  tag: string;
  posts: Array<Post>;
}>
export type ViewsMeta = Array<{
  post: string;
  views: number;
}>

export interface Metadata {
  public: {
    authors: AuthorsMeta;
    folders: FoldersMeta;
    tags: TagsMeta;
    views: ViewsMeta;
  }
  secret: {
    "proposed-tags": Array<string>;
    "unique-views":  number;  // TODO: true? or an array?
  }
}

export interface Foundation {
  provider: Provider;
  metadata: Metadata;
  almoners: Array<Ship>;
  janitors: Array<Ship>;
}

export interface StateFoundation {
  foundation: Foundation;
  name: FoundationName;
}

export interface FoundationWithName {
  provider: Provider;
  metadata: Metadata;
  almoners: Array<Ship>;
  janitors: Array<Ship>;
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

export interface NameAndTag {
  foundation: FoundationName;
  tag: string;
}

export interface AddTagResponse {
  add: NameAndTag;
}

export interface NameAndFolder {
  foundation: FoundationName;
  folder: string;
}

export interface AddFolderResponse {
  add: NameAndFolder;
}


// Response identifiers

export type GallResponse = InitialStateResponse |
  AddFoundationResponse |
  AddAlmonersResponse |
  AddJanitorsResponse |
  AddTagResponse |
  AddFolderResponse

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

export const IsAddTagResponse = (r: GallResponse):
r is AddTagResponse => {
  return (('add' in r) && 'tag' in r.add)
}

export const IsAddFolderResponse = (r: GallResponse):
r is AddFolderResponse => {
  return (('add' in r) && 'folder' in r.add)
}

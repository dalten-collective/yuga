export interface AgentSubscription {
  agentName: string;
  subscriptionNumber: number;
};

export type Ship = `~${ string }` | null
export type FoundationName = string
export type Provider = `${ Ship }/${ FoundationName }`

export type Post = string;  // TODO:

export interface AuthorsMeta {
  author: Ship;
  posts: Array<Post>;
}
export interface FoldersMeta {
  folder: string;
  posts: Array<Post>;
}
export interface TagsMeta {
  tag: string;
  posts: Array<Post>;
}
export interface ViewsMeta {
  post: string;
  views: number;
}

export interface Metadata {
  public: {
    authors: Array<AuthorsMeta>;
    folders: Array<FoldersMeta>;
    tags: Array<TagsMeta>;
    views: Array<ViewsMeta>;
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

export interface FolderPost {
  'post-time': number;
  id: string;
}

export interface Folder {
  folder: string;
  posts: Array<FolderPost>
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
export interface RemAlmonerResponse {
  rem: NameAndAlmoners;
}

export interface NameAndJanitors {
  name: FoundationName;
  janitors: Array<Ship>;
}

export interface AddJanitorsResponse {
  add: NameAndJanitors;
}
export interface RemJanitorResponse {
  rem: NameAndJanitors;
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
  AddAlmonersResponse | RemAlmonerResponse |
  AddJanitorsResponse | RemJanitorResponse |
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
export const IsRemAlmonerResponse = (r: GallResponse):
r is RemAlmonerResponse => {
  return (('rem' in r) && 'almoners' in r.rem)
}

export const IsAddJanitorsResponse = (r: GallResponse):
r is AddJanitorsResponse => {
  return (('add' in r) && 'janitors' in r.add)
}
export const IsRemJanitorResponse = (r: GallResponse):
r is RemJanitorResponse => {
  return (('rem' in r) && 'janitors' in r.rem)
}

export const IsAddTagResponse = (r: GallResponse):
r is AddTagResponse => {
  return (('add' in r) && 'tag' in r.add)
}

export const IsAddFolderResponse = (r: GallResponse):
r is AddFolderResponse => {
  return (('add' in r) && 'folder' in r.add)
}

import * as T from './index'

export interface PostContent {
  inline: Array<string | Object>
}

export type PostList = Array<{ [key: string]: Post }>

export interface Post {
  quippers: Array<T.Ship>;
  author: T.Ship;
  image: string;
  title: string;
  send: number;
  quipCount: number;
  content: Array<PostContent>;
}

export interface PostWithID {
  id: string;
  quippers: Array<T.Ship>;
  author: T.Ship;
  image: string;
  title: string;
  send: number;
  quipCount: number;
  content: Array<PostContent>;
}

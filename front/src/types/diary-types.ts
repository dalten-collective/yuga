import * as T from './index'

export interface PostContent {
  inline: Array<string | Object>
}

export type PostList = Array<{ [key: string]: PostOutline }>

export interface PostOutline {
  quippers: Array<T.Ship>;
  author: T.Ship;
  image: string;
  title: string;
  send: number;
  quipCount: number;
  content: Array<PostContent>;
}

export interface PostOutlineWithID {
  id: string;
  quippers: Array<T.Ship>;
  author: T.Ship;
  image: string;
  title: string;
  send: number;
  quipCount: number;
  content: Array<PostContent>;
}

export interface Seal {
  feels: Object;
  quips: Object;
  time: number;
}

export interface Essay {
  author: T.Ship;
  content: Array<PostContent>;
  image: string;
  sent: number;
  title: string;
}

export interface PostAsSealEssay {
  id?: string;
  essay: Essay;
  seal: Seal;
}

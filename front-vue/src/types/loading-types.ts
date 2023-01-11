export type LoaderState =
  'initial' | 'loading' | 'success' | 'error'

export type UIElement =
  'foundationListHost' |
  'foundationCreate' |
  'foundationSubscribe'

export interface UILoader {
  [key: string]: LoaderState
}
export type StatusMap = {
  [K in LoaderState]: boolean;
}

export type UILoaderState = {
  [K in UIElement]: LoaderState
}

export const loaderStates: UILoader = {
  initial: 'initial',
  loading: 'loading',
  success: 'success',
  error: 'error'
}

declare module 'react-component-component' {
  interface Props<S> {
    initialState?: S,
    didMount?: (opts: { state: S, setState: (state: Partial<S>) => void, props: Props<S>, forceUpdate: (callBack?: () => void) => void }) => void,
    shouldUpdate?: (opts: { state: S, setState: (state: Partial<S>) => void, nextProps: Props<S>, nextState: S }) => boolean,
    didUpdate?: (opts: { state: S, setState: (state: Partial<S>) => void, props: Props<S>, forceUpdate: (callBack?: () => void) => void, prevProps: Props<S>, prevState: S }) => void,
    willUnmount?: (opts: { state: S, props: Props<S> }) => void,
    children: (opts: { state: S, setState: (state: Partial<S>) => void, props: Props<S>, forceUpdate:(callBack?: () => void) => void }) => JSX.Element,
  }

  export default class Component<State> extends React.Component<Props<State>, State> {}
}
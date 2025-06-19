declare module "react" {
  // Minimal runtime typings to satisfy the compiler when @types/react is unavailable.
  export interface ReactElement {
    type: any
    props: any
    key: any
  }

  export type ReactNode = ReactElement | string | number | boolean | null | undefined

  export function createElement(
    type: any,
    props?: any,
    ...children: ReactNode[]
  ): ReactElement

  export function useState<T>(
    initialState: T | (() => T),
  ): [T, (newState: T | ((prevState: T) => T)) => void]

  export function useEffect(
    effect: () => void | (() => void),
    deps?: any[]
  ): void

  export type ChangeEvent<T = Element> = {
    target: T & EventTarget
    currentTarget: T & EventTarget
    // allow other props
    [key: string]: any
  }
  export type FormEvent<T = Element> = {
    target: T & EventTarget
    currentTarget: T & EventTarget
    preventDefault: () => void
    [key: string]: any
  }

  export default {
    createElement,
    useState,
    useEffect,
  }
}

// Provide a very loose JSX namespace so TSX files compile even without full React typings.
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any
  }
}
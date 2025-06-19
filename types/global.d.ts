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

  export type ChangeEvent<T = any> = any
  export type FormEvent<T = any> = any

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
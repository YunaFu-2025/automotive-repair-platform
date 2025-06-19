// Minimal type stubs to satisfy TypeScript when running in constrained environments.
// These should be replaced by the real type packages (e.g. @types/react) in production.

// -----------------------------------------------------------------------------
// React – a tiny subset sufficient for this codebase
// -----------------------------------------------------------------------------
declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type FC<P = any> = (props: P & { children?: ReactNode }) => ReactElement | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type ReactNode = any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type ReactElement = any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type SVGProps<T = any> = any

  // Hooks (simplified)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function useState<S = any>(initialState: S | (() => S)): [S, (value: S) => void]
  export function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<unknown>): void

  // default export (namespace-like)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _default: any
  export default _default
}

// -----------------------------------------------------------------------------
// lucide-react – declare the icon components we actually use
// -----------------------------------------------------------------------------

declare module "lucide-react" {
  import type { FC, SVGProps } from "react"
  export type Icon = FC<SVGProps<SVGSVGElement>>
  export const Search: Icon
  export const Filter: Icon
  export const Clock: Icon
  export const User: Icon
  export const Bot: Icon
  export const Tag: Icon
  export const Car: Icon
  export const Wrench: Icon
  export const AlertCircle: Icon
  export const Upload: Icon
  export const X: Icon
  export const CheckCircle: Icon
  export const Loader2: Icon
  export default {} // fallback
}

// -----------------------------------------------------------------------------
// next/navigation – only the hooks we rely on
// -----------------------------------------------------------------------------

declare module "next/navigation" {
  export interface AppRouterInstance {
    push: (href: string) => void
    replace?: (href: string) => void
    back?: () => void
  }
  export function useRouter(): AppRouterInstance
}

// next/link minimal stub
declare module "next/link" {
  import type { FC, ReactNode } from "react"
  export interface LinkProps {
    href: string
    children?: ReactNode
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Link: FC<LinkProps & any>
  export default Link
}
declare module "lucide-react" {
  import * as React from "react"
  type Icon = React.FC<React.SVGProps<SVGSVGElement>>
  export const Search: Icon
  export const Filter: Icon
  export const Clock: Icon
  export const User: Icon
  export const Bot: Icon
  export const Tag: Icon
  export const Car: Icon
  export const Wrench: Icon
  export const AlertCircle: Icon
  export const ThumbsUp: Icon
  export const MessageCircle: Icon
  export const Lightbulb: Icon
  export const FileText: Icon
  export const ImageIcon: Icon
  export const Upload: Icon
  export const X: Icon
  export const CheckCircle: Icon
  // Fallback export
  const icons: Record<string, Icon>
  export default icons
}
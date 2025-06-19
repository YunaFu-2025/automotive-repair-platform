export type QuestionStatus = "answered" | "pending" | "ai-assisted"

export interface Question {
  id: string
  title: string
  description: string
  vin: string
  brand: string
  model: string
  system: string
  status: QuestionStatus
  submittedAt: string
  submittedBy: string
  answeredBy?: string
  tags: string[]
}
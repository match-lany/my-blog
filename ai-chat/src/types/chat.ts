export interface Message {
  id: number
  content: string
  isUser: boolean
  pending?: boolean
  error?: boolean
}

export interface ChatConfig {
  model: string
  temperature: number
}

export interface ChatResponse {
  content: string
  error?: string
} 
import type { ChatConfig, ChatResponse } from '@/types/chat'

const API_BASE_URL = '/api'

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function sendChatMessage(
  message: string,
  config: ChatConfig,
  systemPrompt?: string
): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      model: config.model,
      temperature: config.temperature,
      systemPrompt
    })
  })

  if (!response.ok) {
    throw new ApiError('发送消息失败', response.status)
  }

  return response
}

export function createEventSource(
  message: string,
  config: ChatConfig,
  systemPrompt?: string
): EventSource {
  const params = new URLSearchParams({
    message,
    model: config.model,
    temperature: String(config.temperature),
    ...(systemPrompt ? { systemPrompt } : {})
  })

  return new EventSource(`${API_BASE_URL}/chat/stream?${params}`)
}

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    throw new ApiError('文件上传失败', response.status)
  }

  const data = await response.json()
  return data.url
} 
import type { ChatConfig } from '@/types/chat'

export class WebSocketClient {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 3
  private reconnectTimeout = 1000

  constructor(private url: string = 'ws://localhost:8080/ws') {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url)

      this.ws.onopen = () => {
        this.reconnectAttempts = 0
        resolve()
      }

      this.ws.onerror = (error) => {
        reject(error)
      }

      this.ws.onclose = () => {
        this.handleDisconnect()
      }
    })
  }

  private handleDisconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        this.connect()
      }, this.reconnectTimeout * this.reconnectAttempts)
    }
  }

  sendMessage(message: string, config: ChatConfig, systemPrompt?: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket 未连接')
    }

    this.ws.send(JSON.stringify({
      message,
      model: config.model,
      temperature: config.temperature,
      systemPrompt
    }))
  }

  onMessage(callback: (data: any) => void) {
    if (this.ws) {
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          callback(data)
        } catch (error) {
          console.error('解析消息失败:', error)
        }
      }
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
} 
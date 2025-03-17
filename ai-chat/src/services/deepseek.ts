import { API_CONFIG } from '@/config/api'
import type { ChatConfig } from '@/types/chat'

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export class DeepseekAPI {
  private baseUrl: string
  private apiKey: string
  private mockMode: boolean

  constructor(mockMode = false) {
    this.baseUrl = API_CONFIG.BASE_URL
    this.apiKey = API_CONFIG.API_KEY
    this.mockMode = mockMode
    console.log('DeepseekAPI initialized:', { 
      baseUrl: this.baseUrl, 
      mockMode: this.mockMode,
      hasApiKey: !!this.apiKey,
      apiKeyLength: this.apiKey ? this.apiKey.length : 0,
      apiKeyPrefix: this.apiKey ? this.apiKey.substring(0, 8) : 'none'
    })
    
    // 确保 API 密钥格式正确
    if (this.apiKey && !this.apiKey.startsWith('sk-')) {
      console.warn('API 密钥格式可能不正确，应该以 sk- 开头')
    }
  }

  async chatCompletion(
    messages: Message[],
    config: ChatConfig
  ): Promise<Response> {
    console.log('chatCompletion called:', { mockMode: this.mockMode })

    if (this.mockMode) {
      console.log('Mock mode is enabled, throwing error')
      throw new Error('Mock mode does not support direct chat completion')
    }

    const requestBody = {
      model: config.model,
      messages,
      temperature: config.temperature,
      stream: true
    }

    console.log('Sending request to Deepseek API:', {
      url: `${this.baseUrl}/chat/completions`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey.substring(0, 8)}...`
      },
      body: requestBody
    })

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API request failed:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      })
      throw new Error(`API 请求失败: ${response.status} ${response.statusText}\n${errorText}`)
    }

    return response
  }

  async streamChatCompletion(
    messages: Message[],
    config: ChatConfig,
    onMessage: (content: string) => void,
    onError: (error: Error) => void
  ) {
    console.log('streamChatCompletion called:', { 
      mockMode: this.mockMode,
      messagesCount: messages.length,
      config
    })

    try {
      if (this.mockMode) {
        console.log('Using mock response')
        const mockResponse = `收到您的消息："${messages[messages.length - 1].content}"，我是模拟的回复。\n\nprint("Hello, World!")`
        for (let i = 0; i < mockResponse.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 50))
          onMessage(mockResponse[i])
        }
        return
      }

      // 确保最后一条消息是用户消息
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role !== 'user') {
        console.error('最后一条消息不是用户消息，这可能导致 API 请求失败');
        // 过滤掉最后一条非用户消息
        messages = messages.filter((msg, index) => 
          index < messages.length - 1 || msg.role === 'user'
        );
      }

      console.log('Calling real API with messages:', messages)
      const response = await this.chatCompletion(messages, config)
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('无法读取响应流')
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        console.log('Received chunk:', chunk)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices[0]?.delta?.content || ''
              if (content) {
                onMessage(content)
              }
            } catch (e) {
              console.error('解析响应数据失败:', e, 'Raw data:', data)
            }
          }
        }
      }
    } catch (error) {
      console.error('API 调用错误:', error)
      onError(error instanceof Error ? error : new Error(String(error)))
    }
  }
} 
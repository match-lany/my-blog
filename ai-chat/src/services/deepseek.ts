import { API_CONFIG } from '@/config/api'
import type { ChatConfig } from '@/types/chat'

// 调试环境变量
console.log('环境变量检查 (deepseek.ts):', {
  hasEnvVar: !!import.meta.env.VITE_DEEPSEEK_API_KEY,
  envVarLength: import.meta.env.VITE_DEEPSEEK_API_KEY?.length,
  envVarPrefix: import.meta.env.VITE_DEEPSEEK_API_KEY?.substring(0, 4)
})

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// 定义DeepSeek API接口
export class DeepseekAPI {
  baseUrl: string
  apiKey: string | undefined
  mockMode: boolean

  constructor(forceMock = false) {
    this.baseUrl = API_CONFIG.BASE_URL
    this.apiKey = API_CONFIG.API_KEY

    // 检查API密钥是否有效
    const hasValidApiKey = this.apiKey && this.apiKey.length > 10 && this.apiKey.startsWith('sk-')

    // 如果没有有效的API密钥并且没有强制模拟，则启用模拟模式
    if (!hasValidApiKey && !forceMock) {
      console.warn('未检测到有效的API密钥，自动启用模拟模式')
      this.mockMode = true
    } else {
      this.mockMode = forceMock
    }

    // 日志初始化信息
    console.log('DeepseekAPI initialized:', {
      baseUrl: this.baseUrl,
      mockMode: this.mockMode,
      hasApiKey: !!this.apiKey,
      apiKeyPrefix: this.apiKey ? this.apiKey.substring(0, 4) + '...' : 'none'
    })

    // 检查API密钥格式
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

    // 确保 API 密钥格式正确
    const apiKey = this.apiKey?.startsWith('Bearer ') ? this.apiKey : `Bearer ${this.apiKey}`
    
    // 调试API密钥
    console.log('API密钥检查:', {
      apiKeyLength: this.apiKey ? this.apiKey.length : 0,
      apiKeyPrefix: this.apiKey ? this.apiKey.substring(0, 4) : 'none',
      formattedKeyPrefix: apiKey.substring(0, 10) + '...',
      isEmpty: !this.apiKey
    })

    console.log('Sending request to Deepseek API:', {
      url: `${this.baseUrl}/chat/completions`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey?.substring(0, 4)}...`
      },
      body: requestBody
    })

    // 检查API密钥是否有效
    if (!this.apiKey || this.apiKey.length < 10) {
      console.error('API密钥无效，无法发送请求')
      throw new Error('API密钥无效，请在环境变量中配置有效的API密钥')
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': apiKey
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API request failed: ', {
          status: response.status,
          statusText: response.statusText,
          errorText
        })
        throw new Error(`API 请求失败: ${response.status} \n${errorText}`)
      }

      return response
    } catch (error) {
      console.error('API 调用错误: ', error)
      throw error
    }
  }

  async streamChatCompletion(
    messages: Message[],
    config: ChatConfig,
    onMessage: (content: string) => void,
    onError: (error: Error) => void,
    onComplete: () => void
  ): Promise<void> {
    console.log('streamChatCompletion called:', { 
      mockMode: this.mockMode, 
      messagesCount: messages.length,
      config
    })

    if (this.mockMode) {
      console.log('使用模拟模式')
      
      // 获取用户最后一条消息
      const userMessage = messages.length > 0 ? 
        messages[messages.length - 1].content.toLowerCase() : ''
      
      // 根据用户消息生成不同的模拟回复
      let mockResponse = ''
      
      if (userMessage.includes('你好') || userMessage.includes('嗨') || 
          userMessage.includes('hi') || userMessage.includes('hello')) {
        mockResponse = '你好！我是AI助手。由于当前处于模拟模式，我的回答是预设的。要使用真实API，请确保配置了有效的API密钥。有什么我可以帮助你的吗？'
      } 
      else if (userMessage.includes('介绍') || userMessage.includes('是谁') || 
               userMessage.includes('功能')) {
        mockResponse = '我是DeepSeek AI助手，目前处于模拟模式。在这个模式下，我的回答是预设的，而不是通过API生成的。要使用完整功能，请配置有效的API密钥。我可以帮助回答问题、编写代码、解释概念等。'
      }
      else if (userMessage.includes('代码') || userMessage.includes('编程') || 
               userMessage.includes('程序')) {
        mockResponse = '这是一个简单的JavaScript函数示例：\n\n```javascript\nfunction calculateSum(a, b) {\n  return a + b;\n}\n\nconsole.log(calculateSum(5, 3)); // 输出: 8\n```\n\n请注意，我目前处于模拟模式，无法生成复杂的代码。要获取更好的编程帮助，请配置有效的API密钥。'
      }
      else {
        mockResponse = '感谢你的提问。由于当前处于模拟模式（未检测到有效的API密钥），我只能提供预设的回答。要获取更准确的回复，请在环境变量中配置有效的DeepSeek API密钥。有其他问题吗？'
      }
      
      // 模拟流式响应
      let currentIndex = 0
      const interval = setInterval(() => {
        if (currentIndex < mockResponse.length) {
          const char = mockResponse[currentIndex]
          onMessage(char)
          currentIndex++
        } else {
          clearInterval(interval)
          onComplete()
        }
      }, 20) // 每20毫秒发送一个字符
      
      return
    }

    try {
      const response = await this.chatCompletion(messages, config)
      
      if (!response.body) {
        throw new Error('Response body is null')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      
      let buffer = ''
      
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          onComplete()
          break
        }
        
        buffer += decoder.decode(value, { stream: true })
        
        // 处理数据块
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            
            if (data === '[DONE]') {
              onComplete()
              return
            }
            
            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices[0]?.delta?.content || ''
              
              if (content) {
                onMessage(content)
              }
            } catch (e) {
              console.error('Error parsing JSON:', e)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in streamChatCompletion:', error)
      onError(error instanceof Error ? error : new Error(String(error)))
    }
  }
} 
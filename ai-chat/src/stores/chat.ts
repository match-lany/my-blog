import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Message, ChatConfig } from '@/types/chat'

export const useChatStore = defineStore('chat', () => {
  // 状态
  const messages = ref<Message[]>([])
  
  const config = ref<ChatConfig>({
    model: 'deepseek-reasoner',  // 固定使用深度思考模型
    temperature: 0.7  // 使用默认温度值
  })

  // 计算属性
  const chatHistory = computed(() => {
    const history = []
    
    // 添加系统提示
    history.push({
      role: 'system',
      content: '你是一个有帮助的AI助手。'
    })

    // 找到最后一条用户消息的索引
    let lastUserMessageIndex = -1;
    for (let i = messages.value.length - 1; i >= 0; i--) {
      if (messages.value[i].isUser) {
        lastUserMessageIndex = i;
        break;
      }
    }

    // 只添加到最后一条用户消息为止的消息
    for (let i = 0; i < messages.value.length; i++) {
      // 如果是最后一条用户消息之后的助手消息，则跳过
      if (i > lastUserMessageIndex && !messages.value[i].isUser) {
        continue;
      }
      
      history.push({
        role: messages.value[i].isUser ? 'user' : 'assistant',
        content: messages.value[i].content
      });
    }

    return history
  })

  // 方法
  function addMessage(message: Omit<Message, 'id'>) {
    const id = messages.value.length + 1
    messages.value.push({ ...message, id })
    return id
  }

  function updateMessage(id: number, update: Partial<Message>) {
    const index = messages.value.findIndex(msg => msg.id === id)
    if (index !== -1) {
      messages.value[index] = { ...messages.value[index], ...update }
    }
  }

  function clearMessages() {
    messages.value = []
  }

  return {
    messages,
    config,
    chatHistory,
    addMessage,
    updateMessage,
    clearMessages
  }
}) 
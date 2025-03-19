<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-semibold text-gray-800">AI 助手</h1>
          <div class="flex items-center space-x-2">
            <button 
              @click="clearConversation" 
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="清空对话"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
            <button 
              @click="showSettings = true" 
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="设置"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 主聊天区域 -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <!-- 欢迎消息 -->
      <div class="text-center mb-8">
        <h2 class="text-2xl font-medium text-gray-900 mb-2">欢迎使用 AI 助手</h2>
        <p class="text-gray-600">我可以帮助你解答问题、编写代码、创作文章等</p>
      </div>

      <!-- 消息列表 -->
      <div class="h-[calc(100vh-20rem)] overflow-y-auto bg-white rounded-lg shadow-sm border border-gray-200 p-4" ref="messageList">
        <div class="space-y-4">
          <div v-for="message in messages" :key="message.id"
               class="flex flex-col">
            <div :class="[
              'message-bubble',
              message.isUser ? 'user-message' : 'ai-message',
              message.pending ? 'opacity-70' : '',
              message.error ? 'bg-red-100 text-red-800 border-red-300' : ''
            ]">
              <div v-if="message.pending" class="flex items-center space-x-2">
                <div class="loading-spinner"></div>
                <span>正在思考...</span>
              </div>
              <div v-else v-html="formatMessage(message.content)"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div class="max-w-4xl mx-auto">
          <div class="flex items-center space-x-2">
            <div class="flex-1">
              <textarea
                v-model="inputMessage"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="输入消息..."
                @keydown.enter.prevent="handleSendMessage"
              ></textarea>
            </div>
            <button 
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="handleSendMessage"
              :disabled="!inputMessage.trim()">
              发送
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- 设置部分 -->
    <div v-if="showSettings" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 class="text-xl font-bold mb-4 dark:text-white">设置</h2>
        
        <!-- API密钥设置 -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            DeepSeek API 密钥
          </label>
          <div class="flex">
            <input 
              type="password" 
              v-model="apiKeyInput" 
              placeholder="sk-..." 
              class="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg p-2 dark:bg-gray-700 dark:text-white"
            />
            <button 
              @click="saveApiKey" 
              class="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
            >
              保存
            </button>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            API密钥只会保存在您的浏览器本地，不会发送到服务器
          </p>
          <div v-if="apiKeyMessage" :class="`text-sm mt-1 ${apiKeyMessageType === 'success' ? 'text-green-500' : 'text-red-500'}`">
            {{ apiKeyMessage }}
          </div>
        </div>
        
        <!-- 其他设置 -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            模型
          </label>
          <select 
            v-model="settings.model" 
            class="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 dark:bg-gray-700 dark:text-white"
          >
            <option 
              v-for="model in AVAILABLE_MODELS" 
              :key="model.value" 
              :value="model.value"
            >
              {{ model.label }}
            </option>
          </select>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            温度 ({{ settings.temperature }})
          </label>
          <input 
            type="range" 
            v-model="settings.temperature" 
            min="0" 
            max="1" 
            step="0.1" 
            class="w-full"
          />
          <div class="flex justify-between text-xs text-gray-500">
            <span>精确</span>
            <span>创造性</span>
          </div>
        </div>
        
        <div class="flex justify-end">
          <button 
            @click="showSettings = false" 
            class="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 mr-2"
          >
            取消
          </button>
          <button 
            @click="saveSettings" 
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import { useChatStore } from '@/stores/chat'
import { DeepseekAPI } from '@/services/deepseek'

// 初始化 marked
marked.setOptions({
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  },
  breaks: true,
  gfm: true
})

// 状态管理
const chatStore = useChatStore()
const { messages, config } = storeToRefs(chatStore)

// 本地状态
const inputMessage = ref('')
const messageList = ref<HTMLDivElement>()

// 创建 API 实例
const api = new DeepseekAPI()

// API密钥管理
const apiKeyInput = ref('') 
const apiKeyMessage = ref('')
const apiKeyMessageType = ref('success')

// 界面状态
const isProcessing = ref(false)
const showSettings = ref(false)

// 方法
const formatMessage = (content: string) => {
  return marked(content)
}

const scrollToBottom = async () => {
  await nextTick()
  if (messageList.value) {
    messageList.value.scrollTop = messageList.value.scrollHeight
  }
}

const handleSendMessage = async () => {
  const message = inputMessage.value.trim()
  if (!message) return

  // 清空输入框
  inputMessage.value = ''

  // 添加用户消息
  chatStore.addMessage({
    content: message,
    isUser: true
  })

  // 获取聊天历史
  const history = chatStore.chatHistory

  // 添加 AI 响应消息
  const aiMessageId = chatStore.addMessage({
    content: '',
    isUser: false,
    pending: true
  })

  try {
    let isFirstChunk = true
    await api.streamChatCompletion(
      history,
      config.value,
      (content) => {
        if (isFirstChunk) {
          // 第一次收到内容时，更新状态
          chatStore.updateMessage(aiMessageId, {
            content: content,
            pending: false
          })
          isFirstChunk = false
        } else {
          // 后续内容追加
          chatStore.updateMessage(aiMessageId, {
            content: messages.value[aiMessageId - 1].content + content,
            pending: false
          })
        }
        scrollToBottom()
      },
      (error) => {
        chatStore.updateMessage(aiMessageId, {
          content: '发送消息失败：' + error.message,
          pending: false,
          error: true
        })
      },
      () => {
        // 完成回调
        chatStore.updateMessage(aiMessageId, {
          pending: false
        })
        scrollToBottom()
      }
    )
  } catch (error) {
    chatStore.updateMessage(aiMessageId, {
      content: '发送消息失败，请重试',
      pending: false,
      error: true
    })
  }
}

// 生命周期钩子
onMounted(() => {
  scrollToBottom()
  const savedApiKey = localStorage.getItem('deepseek_api_key')
  if (savedApiKey) {
    apiKeyInput.value = savedApiKey
    api.setApiKey(savedApiKey)
  }
})

// 监听消息变化，自动滚动
watch(messages, scrollToBottom, { deep: true })

// 保存API密钥
function saveApiKey() {
  try {
    if (!apiKeyInput.value) {
      apiKeyMessage.value = '请输入API密钥'
      apiKeyMessageType.value = 'error'
      return
    }
    
    if (!apiKeyInput.value.startsWith('sk-')) {
      apiKeyMessage.value = 'API密钥格式不正确，应该以sk-开头'
      apiKeyMessageType.value = 'error'
      return
    }
    
    localStorage.setItem('deepseek_api_key', apiKeyInput.value)
    api.setApiKey(apiKeyInput.value)
    
    apiKeyMessage.value = 'API密钥已保存'
    apiKeyMessageType.value = 'success'
    
    // 3秒后清除消息
    setTimeout(() => {
      apiKeyMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('保存API密钥时出错', error)
    apiKeyMessage.value = '保存API密钥时出错'
    apiKeyMessageType.value = 'error'
  }
}

// 保存设置
function saveSettings() {
  localStorage.setItem('chat_settings', JSON.stringify(settings.value))
  showSettings.value = false
}
</script>

<style>
.message-bubble {
  @apply rounded-lg p-3 max-w-[85%] break-words mb-2;
}

.user-message {
  @apply bg-blue-500 text-white self-end;
}

.ai-message {
  @apply bg-white border border-gray-200 self-start;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .message-bubble {
    @apply max-w-[90%];
  }
}

/* 确保输入区域在移动设备上有足够的空间 */
main {
  padding-bottom: 8rem;
}

/* Markdown 样式 */
.ai-message div {
  @apply text-gray-800;
}

/* 标题样式 */
.ai-message h1 {
  @apply text-2xl font-bold my-3;
}

.ai-message h2 {
  @apply text-xl font-bold my-2;
}

.ai-message h3 {
  @apply text-lg font-bold my-2;
}

.ai-message h4 {
  @apply text-base font-bold my-1;
}

/* 段落样式 */
.ai-message p {
  @apply my-2;
}

/* 代码块样式 */
.ai-message pre {
  @apply bg-gray-800 text-white p-4 rounded-lg my-2 overflow-x-auto text-sm;
}

.ai-message code {
  @apply font-mono;
}

.ai-message p code {
  @apply bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm;
}

/* 链接样式 */
.ai-message a {
  @apply text-blue-500 hover:underline;
}

/* 列表样式 */
.ai-message ul {
  @apply list-disc pl-5 my-2;
}

.ai-message ol {
  @apply list-decimal pl-5 my-2;
}

/* 表格样式 */
.ai-message table {
  @apply w-full border-collapse my-3;
}

.ai-message th {
  @apply bg-gray-100 border border-gray-300 px-3 py-2 text-left;
}

.ai-message td {
  @apply border border-gray-300 px-3 py-2;
}

/* 引用样式 */
.ai-message blockquote {
  @apply border-l-4 border-gray-300 pl-4 py-1 my-2 text-gray-600 italic;
}

/* 水平线样式 */
.ai-message hr {
  @apply my-4 border-t border-gray-300;
}

/* 滚动条样式 */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

/* 加载动画样式 */
.loading-spinner {
  @apply w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 
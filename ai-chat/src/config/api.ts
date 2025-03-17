export const API_CONFIG = {
  BASE_URL: 'https://api.deepseek.com/v1',
  API_KEY: process.env.DEEPSEEK_API_KEY || '' // 从环境变量中获取 API 密钥
}

export const AVAILABLE_MODELS = [
  {
    label: 'DeepSeek Chat',
    value: 'deepseek-chat'
  },
  {
    label: 'DeepSeek Reasoner',
    value: 'deepseek-reasoner'
  }
] 
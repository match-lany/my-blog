// AI聊天应用配置
window.AI_CHAT_CONFIG = {
  // API密钥配置
  apiKey: '', // 在这里填入你的API密钥
  apiBaseUrl: 'https://api.deepseek.com/v1',
  // 默认设置
  defaultModel: 'deepseek-chat',
  // 模拟模式配置
  mockMode: {
    enabled: true,
    responses: [
      "这是模拟模式的回复。要使用真实AI功能，请配置有效的API密钥。",
      "您当前正在使用模拟模式。如需完整功能，请在config.js中设置API密钥。",
      "模拟模式已激活。真实AI体验需要配置API密钥。"
    ]
  }
}; 
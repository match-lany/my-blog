# AI 聊天助手

基于 Vue 3 和 DeepSeek API 开发的聊天助手应用。

## 功能特点

- 使用 DeepSeek Reasoner 模型进行对话
- 支持 Markdown 格式的消息显示
- 代码高亮显示
- 流式响应，实时显示 AI 回复

## 技术栈

- Vue 3
- TypeScript
- Tailwind CSS
- Pinia 状态管理
- Marked.js (Markdown 解析)
- Highlight.js (代码高亮)

## 开发设置

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 构建生产版本

```bash
# 构建生产版本
npm run build
```

## 使用说明

1. 在输入框中输入您的问题或指令
2. 点击发送按钮或按 Enter 键发送消息
3. AI 助手将实时生成并显示回复

## 配置

在 `src/config/api.ts` 文件中配置您的 DeepSeek API 密钥：

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://api.deepseek.com/v1',
  API_KEY: '您的API密钥'
}
``` 
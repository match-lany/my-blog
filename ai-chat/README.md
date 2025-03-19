# AI 助手

一个基于 DeepSeek API 的智能对话助手，可以帮助回答问题、编写代码、创作文章等。

## 功能特点

- 💬 智能对话：支持自然语言交互
- 💻 代码辅助：帮助编写和解释代码
- 📝 文章创作：协助撰写和优化文章
- 🎨 美观界面：现代化的UI设计
- 🔄 实时响应：流式输出，即时反馈
- 🔒 安全可靠：支持API密钥配置

## 技术栈

- Vue 3
- TypeScript
- Tailwind CSS
- Vite
- Pinia

## 开始使用

1. 克隆项目：

```bash
git clone https://github.com/your-username/ai-chat.git
cd ai-chat
```

2. 安装依赖：

```bash
npm install
```

3. 配置环境变量：

复制 `.env.example` 文件并重命名为 `.env.local`（开发环境）或 `.env.production`（生产环境），然后填入你的 DeepSeek API 密钥：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件：

```env
VITE_DEEPSEEK_API_KEY=your-api-key-here
```

> ⚠️ **安全警告** ⚠️
> 
> - 永远不要将包含API密钥的 `.env` 文件提交到公共仓库
> - 请确保 `.env`、`.env.local` 和 `.env.production` 文件已添加到 `.gitignore`
> - 如果意外提交了API密钥，请立即在服务提供商处重置您的密钥

4. 启动开发服务器：

```bash
npm run dev
```

5. 构建生产版本：

```bash
npm run build
```

## 部署说明

在生产环境部署时，请使用环境变量或服务器配置来设置API密钥，而不是提交包含实际密钥的配置文件。

### Vercel 部署

在 Vercel 中，可以在项目设置的 Environment Variables 部分添加 `VITE_DEEPSEEK_API_KEY` 环境变量。

## 使用说明

1. 在输入框中输入你的问题或需求
2. 点击发送按钮或按回车键发送消息
3. AI助手会实时生成回复
4. 支持代码高亮显示和Markdown格式

## 注意事项

- 请确保在使用前配置有效的 DeepSeek API 密钥
- 如果没有配置API密钥，应用会自动切换到模拟模式
- 模拟模式下的回复是预设的，不会调用实际的API

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT 
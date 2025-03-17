import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd())
  
  console.log('构建模式:', mode)
  console.log('环境变量:', {
    hasApiKey: !!env.DEEPSEEK_API_KEY,
    apiKeyLength: env.DEEPSEEK_API_KEY ? env.DEEPSEEK_API_KEY.length : 0,
    apiKeyPrefix: env.DEEPSEEK_API_KEY ? env.DEEPSEEK_API_KEY.substring(0, 4) : 'none'
  })
  
  return {
    plugins: [vue()],
    base: './',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
        '/ws': {
          target: 'ws://localhost:8080',
          ws: true,
        },
      },
    },
    define: {
      // 确保环境变量可以在客户端代码中使用
      'process.env.DEEPSEEK_API_KEY': JSON.stringify(env.DEEPSEEK_API_KEY || '')
    }
  }
}) 
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
// Note: This config is for Vite-based builds. Next.js uses its own config.
export default defineConfig({
  plugins: [react()],
  
  // 开发服务器配置
  server: {
    port: 3000,
    host: true,
    open: true,
    cors: true,
    proxy: {
      // 代理API请求到后端服务器
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      // 代理WebSocket连接
      '/ws': {
        target: 'ws://localhost:3003',
        ws: true,
        changeOrigin: true
      }
    }
  },

  // 构建配置
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    } as unknown as import('vite').TerserOptions,
    rollupOptions: {
      output: {
        manualChunks: {
          // 将大型依赖分离到单独的chunk
          vendor: ['react', 'react-dom'],
          ui: ['@headlessui/react', '@heroicons/react'],
          web3: ['ethers', 'web3'],
          charts: ['recharts', 'chart.js']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },

  // 路径别名配置
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@services': path.resolve(__dirname, './src/services'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@config': path.resolve(__dirname, './src/config')
    }
  },

  // 环境变量配置
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  },

  // CSS配置
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    },
    modules: {
      localsConvention: 'camelCase'
    }
  },

  // 优化配置
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'ethers',
      'web3',
      'recharts'
    ],
    exclude: ['@vite/client', '@vite/env']
  },

  // 预览配置
  preview: {
    port: 3000,
    host: true,
    cors: true
  },

  // 测试配置 - 移至 vitest.config.ts 或使用 Jest
  // test: {
  //   globals: true,
  //   environment: 'jsdom',
  //   setupFiles: ['./src/test/setup.ts'],
  //   css: true
  // }
})

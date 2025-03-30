import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/components/**/*.vue', 'src/plugins/**/*.ts', 'src/composables/**/*.ts'],
      outDir: 'dist/types',
      tsconfigPath: 'tsconfig.app.json',
      entryRoot: 'src',
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/plugins/index.ts'),
      name: 'BpmnEditor',
      fileName: (format) => `bpmn-editor.${format}.js`,
    },
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      external: [
        'vue',
        'element-plus',
        '@antv/x6',
        '@antv/x6-vue-shape',
        'bpmn-moddle',
        'camunda-bpmn-moddle',
        '@element-plus/icons-vue',
      ],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
          '@antv/x6': 'X6',
          '@antv/x6-vue-shape': 'X6VueShape',
          'bpmn-moddle': 'BpmnModdle',
          'camunda-bpmn-moddle': 'CamundaBpmnModdle',
          '@element-plus/icons-vue': 'ElementPlusIconsVue',
        },
        indent: true,
        banner: '/* @onigeya/bpmn-editor - MIT License */',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'bpmn-editor.css'
          }
          return assetInfo.name || 'unknown'
        },
      },
    },
    cssCodeSplit: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
})

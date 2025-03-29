# @onigeya/bpmn-editor

一个基于 Vue 3 开发的轻量级、可扩展的 BPMN 流程图编辑器组件。

## 特性

- 🚀 基于 Vue 3 + TypeScript 开发
- 📦 基于 bpmn-moddle 和 camunda-bpmn-moddle 的 BPMN 2.0 标准支持
- 🎨 使用 Element Plus 的美观 UI 组件
- 🔌 基于 AntV X6 的强大图形编辑能力
- 🛠 支持流程图的导入导出
- 📱 响应式设计，支持移动端

## 技术栈

- Vue 3 + TypeScript - 现代化的前端开发框架
- Element Plus - 美观易用的 UI 组件库
- AntV X6 - 专业的图编辑引擎
- bpmn-moddle - BPMN 2.0 模型解析和序列化
- camunda-bpmn-moddle - Camunda BPMN 扩展支持

## 安装

```sh
# NPM
npm install @onigeya/bpmn-editor

# Yarn
yarn add @onigeya/bpmn-editor

# PNPM
pnpm add @onigeya/bpmn-editor
```

## 使用方法

### 全局注册

```ts
// main.ts
import { createApp } from 'vue'
import BpmnEditor from '@onigeya/bpmn-editor'
import '@onigeya/bpmn-editor/dist/style.css'

const app = createApp(App)
app.use(BpmnEditor)
app.mount('#app')
```

### 组件中使用

```vue
<template>
  <BpmnEditor v-model="bpmnXml" :readonly="false" @save="handleSave" @error="handleError" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const bpmnXml = ref('')

const handleSave = (xml: string) => {
  console.log('保存的 BPMN XML:', xml)
}

const handleError = (error: Error) => {
  console.error('发生错误:', error)
}
</script>
```

## API

### Props

| 属性名   | 类型              | 默认值  | 说明                  |
| -------- | ----------------- | ------- | --------------------- |
| v-model  | string            | ''      | BPMN XML 数据双向绑定 |
| readonly | boolean           | false   | 是否为只读模式        |
| theme    | 'light' \| 'dark' | 'light' | 主题设置              |

### Events

| 事件名 | 参数                   | 说明                 |
| ------ | ---------------------- | -------------------- |
| save   | (xml: string) => void  | 保存 BPMN XML 时触发 |
| error  | (error: Error) => void | 发生错误时触发       |
| change | (xml: string) => void  | BPMN XML 变更时触发  |

## 贡献指南

请查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解如何参与项目开发。

## 许可证

[MIT](./LICENSE)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
pnpm build

# Runs the end-to-end tests
pnpm test:e2e
# Runs the tests only on Chromium
pnpm test:e2e --project=chromium
# Runs the tests of a specific file
pnpm test:e2e tests/example.spec.ts
# Runs the tests in debug mode
pnpm test:e2e --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

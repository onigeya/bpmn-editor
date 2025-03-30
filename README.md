# @onigeya/bpmn-editor

一个基于 Vue 3 开发的轻量级 BPMN 流程图编辑器组件。

## 特性

- 🚀 基于 Vue 3 + TypeScript 开发
- 📦 基于 bpmn-moddle 的 BPMN 2.0 标准支持
- 🎨 使用 Element Plus 的美观 UI 组件
- 🔌 基于 AntV X6 的图形编辑能力
- 🛠 支持流程图的导入导出
- 📋 内置属性面板，支持查看节点、连线和流程属性

## 技术栈

- Vue 3 + TypeScript - 现代化的前端开发框架
- Element Plus - 美观易用的 UI 组件库
- AntV X6 - 专业的图编辑引擎
- bpmn-moddle - BPMN 2.0 模型解析和序列化

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
import '@onigeya/bpmn-editor/dist/bpmn-editor.css'

const app = createApp(App)
app.use(BpmnEditor)
app.mount('#app')
```

### 组件中使用

```vue
<template>
  <BpmnEditor />
</template>
```

## 组件说明

`BpmnEditor` 组件是一个完整的 BPMN 流程图编辑器，包含以下功能：

- 工具栏：提供流程图的导入导出功能
- 画布：用于绘制和编辑流程图
- 属性面板：用于查看和编辑节点、连线和流程属性

## 贡献指南

请查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解如何参与项目开发。

## 许可证

[MIT](./LICENSE)

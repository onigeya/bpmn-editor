# 贡献指南

感谢您对 @onigeya/bpmn-editor 项目的关注！我们欢迎任何形式的贡献。

## 开发环境设置

1. 克隆仓库

```sh
git clone https://github.com/onigeya/bpmn-editor.git
cd bpmn-editor
```

2. 安装依赖

```sh
pnpm install
```

3. 启动开发服务器

```sh
pnpm dev
```

## 项目结构

```
src/
├── components/           # Vue组件
│   ├── BpmnEditor.vue   # 主编辑器组件
│   ├── BpmnToolbar.vue  # 工具栏组件
│   ├── BpmnCanvas.vue   # 画布组件
│   └── BpmnDrawer.vue   # 属性面板组件
├── composables/         # 组合式函数
│   ├── useGraph.ts     # 图形相关的逻辑
│   └── useImportExport.ts # 导入导出相关的逻辑
├── stores/             # 状态管理
│   └── bpmnStore.ts    # BPMN 相关的状态
└── plugins/            # 插件
    └── index.ts        # 插件注册（导出组件库）

tests/
├── unit/              # 单元测试
│   └── components/    # 组件测试
└── e2e/              # 端到端测试
    └── example.spec.ts

构建输出:
dist/
├── types/                  # 类型声明文件
├── bpmn-editor.css        # 样式文件
├── bpmn-editor.es.js      # ES Module 格式构建产物
└── bpmn-editor.umd.js     # UMD 格式构建产物
```

## 主要组件说明

### BpmnEditor.vue

- 主编辑器组件
- 负责组织和布局其他子组件

### BpmnToolbar.vue

- 工具栏组件
- 提供导入导出功能
- 使用 Element Plus 的 Upload 组件实现文件导入

### BpmnCanvas.vue

- 画布组件
- 使用 AntV X6 实现图形编辑功能
- 通过 useGraph 组合式函数管理图形操作

### BpmnDrawer.vue

- 属性面板组件
- 使用 Element Plus 的 Drawer 组件
- 展示节点、连线和流程的属性信息

## 开发流程

1. 创建新分支

```sh
git checkout -b feature/your-feature
```

2. 开发和测试

```sh
# 启动开发服务器
pnpm dev

# 运行单元测试（tests/unit 目录下的测试）
pnpm test:unit run

# 运行单个测试文件
pnpm test:unit run tests/unit/components/BpmnEditor.spec.ts

# 运行端到端测试
pnpm test:e2e
```

3. 提交代码

```sh
git add .
git commit -m "feat: add your feature"
```

4. 推送分支并创建 Pull Request

```sh
git push origin feature/your-feature
```

## 代码规范

- 使用 TypeScript 编写代码
- 遵循 ESLint 和 Prettier 配置
- 组件使用 Composition API
- 提交信息遵循 Conventional Commits 规范
- 确保添加适当的单元测试和E2E测试

## 测试指南

### 单元测试

- 所有测试文件放在 `tests/unit` 目录下
- 组件测试放在 `tests/unit/components` 目录下
- 使用 `.spec.ts` 或 `.test.ts` 作为测试文件扩展名
- 使用 Vitest 作为测试框架

```sh
# 运行所有单元测试
pnpm test:unit run

# 运行特定测试文件
pnpm test:unit run tests/unit/components/BpmnEditor.spec.ts

# 以 watch 模式运行测试
pnpm test:unit
```

### E2E测试

- 所有E2E测试文件放在 `tests/e2e` 目录下
- 使用 Playwright 作为测试框架

```sh
# 运行所有E2E测试
pnpm test:e2e

# 运行特定浏览器的测试
pnpm test:e2e --project=chromium

# 以调试模式运行测试
pnpm test:e2e --debug
```

## 构建

```sh
# 构建库
pnpm build
```

## 发布流程

1. 更新版本号

```sh
pnpm version patch|minor|major
```

2. 构建库

```sh
pnpm build
```

3. 发布到 NPM

```sh
pnpm publish
```

## 许可证

通过提交 Pull Request，您同意将您的代码按照 MIT 许可证授权给本项目。

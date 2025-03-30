<template>
  <el-drawer
    v-model="drawerVisible"
    :title="drawerTitle"
    direction="rtl"
    size="30%"
    :before-close="handleClose"
  >
    <div class="property-panel">
      <!-- 节点属性 -->
      <template v-if="currentElement.type === 'node'">
        <div class="property-item">
          <div class="label">节点ID：</div>
          <div class="value">{{ currentElement.id }}</div>
        </div>
        <div class="property-item">
          <div class="label">节点类型：</div>
          <div class="value">{{ getNodeType(currentElement.data?.original?.$type) }}</div>
        </div>
        <div class="property-item" v-if="currentElement.data?.original?.name">
          <div class="label">节点名称：</div>
          <div class="value">{{ currentElement.data.original.name }}</div>
        </div>
      </template>

      <!-- 连线属性 -->
      <template v-else-if="currentElement.type === 'edge'">
        <div class="property-item">
          <div class="label">连线ID：</div>
          <div class="value">{{ currentElement.id }}</div>
        </div>
        <div class="property-item">
          <div class="label">连线类型：</div>
          <div class="value">{{ getEdgeType(currentElement.data?.original?.$type) }}</div>
        </div>
        <div class="property-item" v-if="currentElement.data?.original?.name">
          <div class="label">连线名称：</div>
          <div class="value">{{ currentElement.data.original.name }}</div>
        </div>
        <div class="property-item">
          <div class="label">源节点：</div>
          <div class="value">{{ getSourceNodeId() }}</div>
        </div>
        <div class="property-item">
          <div class="label">目标节点：</div>
          <div class="value">{{ getTargetNodeId() }}</div>
        </div>
      </template>

      <!-- 流程属性 -->
      <template v-else>
        <div class="property-item">
          <div class="label">流程ID：</div>
          <div class="value">{{ processId }}</div>
        </div>
        <div class="property-item">
          <div class="label">可执行：</div>
          <div class="value">{{ isExecutable ? '是' : '否' }}</div>
        </div>
        <div class="property-item">
          <div class="label">节点数量：</div>
          <div class="value">{{ getNodeCount() }}</div>
        </div>
        <div class="property-item">
          <div class="label">连线数量：</div>
          <div class="value">{{ getEdgeCount() }}</div>
        </div>
      </template>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBpmnStore } from '../stores/bpmnStore'
import { storeToRefs } from 'pinia'
import type { BaseElement, FlowElement } from 'bpmn-moddle'

// 获取store中的状态
const store = useBpmnStore()
const { drawerVisible, currentElement } = storeToRefs(store)

// 关闭抽屉
const handleClose = () => {
  store.closeDrawer()
}

// 计算属性
const drawerTitle = computed(() => {
  switch (currentElement.value.type) {
    case 'node':
      return '节点属性'
    case 'edge':
      return '连线属性'
    default:
      return '流程属性'
  }
})

// 获取流程信息
const processId = computed(() => {
  if (currentElement.value.type !== 'canvas') return ''

  const definitions = store.definitions
  if (!definitions) return '未知'

  const process = definitions.rootElements.find(
    (element: BaseElement) => element.$type === 'bpmn:Process',
  )
  return process?.id || '未知'
})

const isExecutable = computed(() => {
  if (currentElement.value.type !== 'canvas') return false

  const definitions = store.definitions
  if (!definitions) return false

  const process = definitions.rootElements.find(
    (element: BaseElement) => element.$type === 'bpmn:Process',
  )
  return !!process?.isExecutable
})

// 获取节点类型的用户友好名称
const getNodeType = (type?: string): string => {
  if (!type) return '未知类型'

  switch (type) {
    case 'bpmn:StartEvent':
      return '开始事件'
    case 'bpmn:EndEvent':
      return '结束事件'
    case 'bpmn:Task':
      return '任务'
    case 'bpmn:UserTask':
      return '用户任务'
    case 'bpmn:ServiceTask':
      return '服务任务'
    case 'bpmn:ExclusiveGateway':
      return '排他网关'
    case 'bpmn:ParallelGateway':
      return '并行网关'
    default:
      return type.replace('bpmn:', '')
  }
}

// 获取连线类型的用户友好名称
const getEdgeType = (type?: string): string => {
  if (!type) return '未知类型'

  switch (type) {
    case 'bpmn:SequenceFlow':
      return '顺序流'
    default:
      return type.replace('bpmn:', '')
  }
}

// 获取源节点ID
const getSourceNodeId = (): string => {
  if (currentElement.value.type !== 'edge') return ''

  const source = (currentElement.value.data?.original as FlowElement)?.sourceRef
  return source?.id || '未知'
}

// 获取目标节点ID
const getTargetNodeId = (): string => {
  if (currentElement.value.type !== 'edge') return ''

  const target = (currentElement.value.data?.original as FlowElement)?.targetRef
  return target?.id || '未知'
}

// 获取节点数量
const getNodeCount = (): number => {
  return store.graphData?.nodes?.length || 0
}

// 获取连线数量
const getEdgeCount = (): number => {
  return store.graphData?.edges?.length || 0
}
</script>

<style lang="scss" scoped>
.property-panel {
  padding: 10px;

  .property-item {
    margin-bottom: 15px;

    .label {
      font-weight: bold;
      margin-bottom: 5px;
      color: #606266;
    }

    .value {
      color: #303133;
      word-break: break-all;
    }
  }
}
</style>

<template>
  <el-card shadow="hover" class="event-node" :class="config.size">
    <div class="event-content">
      {{ label }}
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ElCard } from 'element-plus'
import type { Node } from '@antv/x6'
import { useGlobalConfig } from 'element-plus'
import { computed } from 'vue'

const config = useGlobalConfig()

const props = defineProps<{
  node: Node
}>()

const label = computed(() => {
  switch (props.node.data?.original.$type) {
    case 'bpmn:StartEvent':
      return '开始'
    case 'bpmn:EndEvent':
      return '结束'
    case 'bpmn:IntermediateCatchEvent':
      return '中间捕获'
    case 'bpmn:IntermediateThrowEvent':
      return '中间抛出'
    default:
      return ''
  }
})
</script>

<style lang="scss" scoped>
.event-node {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  font-size: var(--el-font-size-small);

  &.small {
    font-size: var(--el-font-size-extra-small);
  }

  &.large {
    font-size: var(--el-font-size-medium);
  }

  :deep(.el-card__body) {
    height: 100%;
    width: 100%;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

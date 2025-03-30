<template>
  <el-card shadow="hover" class="gateway-node" :class="config.size">
    <div class="gateway-content">
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
    case 'bpmn:ExclusiveGateway':
      return '条件分支'
    case 'bpmn:ParallelGateway':
      return '并行分支'
    case 'bpmn:InclusiveGateway':
      return '并行分支'
    case 'bpmn:EventBasedGateway':
      return '事件分支'
    case 'bpmn:ComplexGateway':
      return '复杂分支'
    case 'bpmn:DataObjectReference':
      return '数据对象引用'
    case 'bpmn:DataStoreReference':
      return '数据存储引用'
    default:
      return ''
  }
})
</script>

<style lang="scss" scoped>
.gateway-node {
  width: 100%;
  height: 100%;
  border-radius: 18px;
  font-size: var(--el-font-size-small);

  &.small {
    font-size: var(--el-font-size-extra-small);
  }

  &.large {
    font-size: var(--el-font-size-medium);
  }

  :deep(.el-card__body) {
    padding: 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

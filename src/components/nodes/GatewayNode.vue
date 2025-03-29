<template>
  <el-card shadow="hover" class="gateway-node" :class="config.size">
    <div class="gateway-content">
      {{ node.data?.label || '' }}
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ElCard } from 'element-plus'
import type { Node } from '@antv/x6'
import { useGlobalConfig } from 'element-plus'

const config = useGlobalConfig()

defineProps<{
  node: Node
}>()
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

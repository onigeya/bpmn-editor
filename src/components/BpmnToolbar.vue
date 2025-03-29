<template>
  <div class="toolbar" :class="config.size">
    <div class="title">导入</div>
    <div class="buttons">
      <el-button type="primary">导入</el-button>
      <el-button type="primary">导出</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalConfig } from 'element-plus'

const config = useGlobalConfig()
</script>

<style lang="scss" scoped>
.toolbar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: var(--el-border);
  padding: 8px 15px;
  box-sizing: border-box;

  .title {
    font-size: var(--el-font-size-medium);
    font-weight: bold;
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  &.small {
    padding: 5px 11px;
    .title {
      font-size: var(--el-font-size-base);
    }
  }

  &.large {
    padding: 12px 19px;
    .title {
      font-size: var(--el-font-size-large);
    }
  }
}
</style>

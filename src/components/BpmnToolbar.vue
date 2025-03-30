<template>
  <div class="toolbar" :class="config.size">
    <div class="title">导入</div>
    <div class="buttons">
      <el-button type="primary" @click="handleImport">导入</el-button>
      <el-button type="primary" @click="handleExport">导出</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalConfig } from 'element-plus'
import { useImportExport } from '../composables/useImportExport'

const config = useGlobalConfig()
const { handleImport, handleExport } = useImportExport()
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
    gap: 8px;
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

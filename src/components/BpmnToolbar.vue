<template>
  <div class="toolbar" :class="config.size">
    <div class="title">导入</div>
    <div class="buttons">
      <el-upload
        action=""
        :auto-upload="false"
        :show-file-list="false"
        accept=".bpmn,.xml"
        :on-change="handleFileChange"
      >
        <el-button type="primary">导入</el-button>
      </el-upload>
      <el-button type="primary" @click="handleExport">导出</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalConfig } from 'element-plus'
import { useImportExport } from '../composables/useImportExport'
import type { UploadFile } from 'element-plus'

const config = useGlobalConfig()
const { parseXmlString, handleExport } = useImportExport()

/**
 * 处理文件选择事件
 */
const handleFileChange = (file: UploadFile) => {
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const xmlContent = e.target?.result as string
    if (xmlContent) {
      parseXmlString(xmlContent)
    }
  }
  reader.readAsText(file.raw as Blob)
}
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

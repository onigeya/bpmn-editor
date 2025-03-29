<template>
  <div class="bpmn-editor">
    <bpmn-toolbar />
    <bpmn-canvas />
  </div>
</template>

<script setup lang="ts">
import BpmnToolbar from './BpmnToolbar.vue'
import BpmnCanvas from './BpmnCanvas.vue'
</script>

<style scoped>
.bpmn-editor {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

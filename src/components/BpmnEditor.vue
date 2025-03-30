<template>
  <div class="bpmn-editor">
    <bpmn-toolbar />
    <bpmn-canvas />
    <bpmn-drawer />
  </div>
</template>

<script setup lang="ts">
import BpmnToolbar from './BpmnToolbar.vue'
import BpmnCanvas from './BpmnCanvas.vue'
import BpmnDrawer from './BpmnDrawer.vue'
</script>

<style lang="scss" scoped>
.bpmn-editor {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

<template>
  <div class="canvas" ref="container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useGraph } from '../composables/useGraph'

const container = ref<HTMLElement>()
const { createGraph, destroyGraph } = useGraph()

onMounted(() => {
  if (!container.value) return
  createGraph(container.value)
})

onUnmounted(() => {
  destroyGraph()
})
</script>

<style scoped>
.canvas {
  flex: 1;
  background-color: #f2f7fa;
  position: relative;
  overflow: hidden;
}
</style>

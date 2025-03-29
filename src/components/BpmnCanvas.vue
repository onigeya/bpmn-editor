<template>
  <div class="canvas" ref="container"></div>
</template>

<script setup lang="ts">
import { Graph } from '@antv/x6'
import { register } from '@antv/x6-vue-shape'
import { onMounted, ref } from 'vue'
import EventNode from './nodes/EventNode.vue'
import TaskNode from './nodes/TaskNode.vue'
import GatewayNode from './nodes/GatewayNode.vue'

// 注册自定义节点
register({
  shape: 'bpmn-event',
  component: EventNode,
  width: 48,
  height: 48,
  ports: {
    groups: {
      top: {
        position: 'top',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
          },
        },
      },
      right: {
        position: 'right',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
          },
        },
      },
      bottom: {
        position: 'bottom',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
          },
        },
      },
      left: {
        position: 'left',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
          },
        },
      },
    },
  },
})

register({
  shape: 'bpmn-task',
  component: TaskNode,
  width: 240,
  height: 144,
  ports: {
    groups: {
      top: {
        position: 'top',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
          },
        },
      },
      right: {
        position: 'right',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
          },
        },
      },
      bottom: {
        position: 'bottom',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
          },
        },
      },
      left: {
        position: 'left',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
          },
        },
      },
    },
  },
})

register({
  shape: 'bpmn-gateway',
  component: GatewayNode,
  width: 72,
  height: 36,
  ports: {
    groups: {
      top: {
        position: 'top',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
          },
        },
      },
      right: {
        position: 'right',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
          },
        },
      },
      bottom: {
        position: 'bottom',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
          },
        },
      },
      left: {
        position: 'left',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
          },
        },
      },
    },
  },
})

const container = ref<HTMLElement>()

onMounted(() => {
  if (!container.value) return

  const graph = new Graph({
    container: container.value,
    width: container.value.clientWidth,
    height: container.value.clientHeight,
    grid: {
      size: 10,
      visible: true,
      type: 'dot',
      args: {
        color: '#a0a0a0',
        thickness: 1,
      },
    },
    connecting: {
      router: 'manhattan',
      connector: {
        name: 'rounded',
        args: {
          radius: 8,
        },
      },
      anchor: 'center',
      connectionPoint: 'anchor',
      allowBlank: false,
      snap: true,
      createEdge() {
        return graph.createEdge({
          attrs: {
            line: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
              targetMarker: {
                name: 'block',
                size: 8,
              },
            },
          },
        })
      },
    },
    background: {
      color: '#F2F7FA',
    },
  })

  // 添加示例节点和边
  const startEvent = graph.addNode({
    shape: 'bpmn-event',
    x: 100,
    y: 76,
    ports: [{ id: 'right', group: 'right' }],
    data: {
      type: 'start',
      label: '开始',
      stroke: '#52c41a',
    },
  })

  const task = graph.addNode({
    shape: 'bpmn-task',
    x: 248,
    y: 28,
    ports: [
      { id: 'left', group: 'left' },
      { id: 'right', group: 'right' },
    ],
    data: {
      label: '用户任务',
      icon: 'data:image/svg+xml;base64,PHN2ZyB0PSIxNzExNzA1NjAwNTk0IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIzODgiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNODU4LjUgNzYzLjZjLTE4LjktMzQuMi01NC45LTYwLjMtOTcuNy03MS40QzY4NC40IDY4MS4yIDYxNy4zIDY3MiA1MTIgNjcycy0xNzIuNCA5LjItMjQ4LjggMjAuMmMtNDIuOSAxMS4xLTc4LjggMzcuMi05Ny43IDcxLjQtMTggMzIuNy0yNC42IDc2LjItMjQuNiAxMDkuMnYzLjRjMCA1OC44IDQ4LjggOTIuOSAxMjAuMyA5Mi45aDUwMS42YzcxLjYgMCAxMjAuMy0zNC4xIDEyMC4zLTkyLjl2LTMuNGMwLjEtMzMtNi41LTc2LjUtMjQuNi0xMDkuMnpNNTEyIDYwNmMxNTkuMSAwIDI4OC0xMjguOSAyODgtMjg4UzY3MS4xIDMwIDUxMiAzMCAyMjQgMTU4LjkgMjI0IDMxOHMxMjguOSAyODggMjg4IDI4OHoiIGZpbGw9IiM4ZjhmOGYiIHAtaWQ9IjIzODkiPjwvcGF0aD48L3N2Zz4=',
    },
  })

  const gateway = graph.addNode({
    shape: 'bpmn-gateway',
    x: 588,
    y: 82,
    ports: [
      { id: 'left', group: 'left' },
      { id: 'right', group: 'right' },
    ],
    data: {
      label: '排他网关',
      icon: 'data:image/svg+xml;base64,PHN2ZyB0PSIxNzExNzA1NjQ3NDg4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM2NTgiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNNTEyIDY4Mi42NjY2NjdMMzQxLjMzMzMzMyA4NTMuMzMzMzMzIDE3MC42NjY2NjcgNjgyLjY2NjY2NyAzNDEuMzMzMzMzIDUxMiAxNzAuNjY2NjY3IDM0MS4zMzMzMzMgMzQxLjMzMzMzMyAxNzAuNjY2NjY3IDUxMiAzNDEuMzMzMzMzIDY4Mi42NjY2NjcgMTcwLjY2NjY2NyA4NTMuMzMzMzMzIDM0MS4zMzMzMzMgNjgyLjY2NjY2NyA1MTIgODUzLjMzMzMzMyA2ODIuNjY2NjY3IDY4Mi42NjY2NjcgODUzLjMzMzMzMyA1MTIgNjgyLjY2NjY2N3oiIGZpbGw9IiM4ZjhmOGYiIHAtaWQ9IjM2NTkiPjwvcGF0aD48L3N2Zz4=',
    },
  })

  const endEvent = graph.addNode({
    shape: 'bpmn-event',
    x: 760,
    y: 76,
    ports: [{ id: 'left', group: 'left' }],
    data: {
      type: 'end',
      label: '结束',
      stroke: '#ff4d4f',
    },
  })

  // 添加连线
  graph.addEdge({
    source: { cell: startEvent, port: 'right' },
    target: { cell: task, port: 'left' },
    attrs: {
      line: {
        stroke: '#8f8f8f',
        strokeWidth: 1,
        targetMarker: {
          name: 'block',
          size: 8,
        },
      },
    },
  })

  graph.addEdge({
    source: { cell: task, port: 'right' },
    target: { cell: gateway, port: 'left' },
    attrs: {
      line: {
        stroke: '#8f8f8f',
        strokeWidth: 1,
        targetMarker: {
          name: 'block',
          size: 8,
        },
      },
    },
  })

  graph.addEdge({
    source: { cell: gateway, port: 'right' },
    target: { cell: endEvent, port: 'left' },
    attrs: {
      line: {
        stroke: '#8f8f8f',
        strokeWidth: 1,
        targetMarker: {
          name: 'block',
          size: 8,
        },
      },
    },
  })
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

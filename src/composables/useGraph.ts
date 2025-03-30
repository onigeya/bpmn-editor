import { Graph } from '@antv/x6'
import { ref, watch } from 'vue'
import { register } from '@antv/x6-vue-shape'
import EventNode from '../components/nodes/EventNode.vue'
import TaskNode from '../components/nodes/TaskNode.vue'
import GatewayNode from '../components/nodes/GatewayNode.vue'
import { useBpmnStore } from '../stores/bpmnStore'
import { storeToRefs } from 'pinia'

const graph = ref<Graph>()
// 存储 watch 的停止函数
const stopWatch = ref<(() => void) | null>(null)

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

export const useGraph = () => {
  const createGraph = (container: HTMLElement) => {
    if (!container) return
    if (graph.value) return graph.value

    graph.value = new Graph({
      container,
      width: container.clientWidth,
      height: container.clientHeight,
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
          return graph.value!.createEdge({
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

    // 设置监听
    const store = useBpmnStore()
    const { graphData } = storeToRefs(store)

    // 保存 watch 的停止函数
    stopWatch.value = watch(
      graphData,
      (newData) => {
        if (graph.value && newData) {
          graph.value.fromJSON(newData)
        }
      },
      { immediate: true },
    )

    // 绑定drawer相关事件
    bindDrawerEvents(graph.value, store)

    return graph.value
  }

  // 绑定drawer相关事件
  const bindDrawerEvents = (graph: Graph, store: ReturnType<typeof useBpmnStore>) => {
    // 监听节点双击事件
    graph.on('node:dblclick', ({ node }) => {
      store.openDrawer('node', node.id, node.data)
    })

    // 监听边双击事件
    graph.on('edge:dblclick', ({ edge }) => {
      store.openDrawer('edge', edge.id, edge.data)
    })

    // 监听画布双击事件
    graph.on('blank:dblclick', () => {
      store.openDrawer('canvas', 'process')
    })
  }

  const destroyGraph = () => {
    // 停止数据监听
    if (stopWatch.value) {
      stopWatch.value()
      stopWatch.value = null
    }

    // 销毁图实例
    if (graph.value) {
      graph.value.dispose()
      graph.value = undefined
    }
  }

  const getGraph = () => graph.value

  return {
    createGraph,
    getGraph,
    destroyGraph,
  }
}

export type { Graph }

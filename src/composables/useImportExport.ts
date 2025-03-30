import { useBpmnStore } from '../stores/bpmnStore'
import { useGraph } from './useGraph'
import type { GraphData } from '../stores/bpmnStore'
import type { Node, Edge } from '@antv/x6'

export const useImportExport = () => {
  const store = useBpmnStore()
  const { getGraph } = useGraph()

  // 示例数据，实际项目中可以通过文件上传或API获取
  const sampleData: GraphData = {
    nodes: [
      {
        id: 'start',
        shape: 'bpmn-event',
        x: 100,
        y: 76,
        ports: [{ id: 'right', group: 'right' }],
        data: {
          type: 'start',
          label: '开始',
          stroke: '#52c41a',
        },
      },
      {
        id: 'task',
        shape: 'bpmn-task',
        x: 248,
        y: 28,
        ports: [
          { id: 'left', group: 'left' },
          { id: 'right', group: 'right' },
        ],
        data: {
          label: '用户任务',
        },
      },
      {
        id: 'gateway',
        shape: 'bpmn-gateway',
        x: 588,
        y: 82,
        ports: [
          { id: 'left', group: 'left' },
          { id: 'right', group: 'right' },
        ],
        data: {
          label: '排他网关',
        },
      },
      {
        id: 'end',
        shape: 'bpmn-event',
        x: 760,
        y: 76,
        ports: [{ id: 'left', group: 'left' }],
        data: {
          type: 'end',
          label: '结束',
          stroke: '#ff4d4f',
        },
      },
    ],
    edges: [
      {
        source: { cell: 'start', port: 'right' },
        target: { cell: 'task', port: 'left' },
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
      },
      {
        source: { cell: 'task', port: 'right' },
        target: { cell: 'gateway', port: 'left' },
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
      },
      {
        source: { cell: 'gateway', port: 'right' },
        target: { cell: 'end', port: 'left' },
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
      },
    ],
  }

  const handleImport = () => {
    // 这里可以添加文件上传或其他数据导入逻辑
    store.graphData = sampleData
  }

  const handleExport = () => {
    const graph = getGraph()
    if (!graph) return

    // 从画布获取最新数据
    const { cells } = graph.toJSON()
    if (!cells) return

    const nodes: Node.Metadata[] = cells.filter((cell) => cell.shape !== 'edge')

    const edges: Edge.Metadata[] = cells.filter((cell) => cell.shape === 'edge')

    // 更新 store 中的数据
    store.graphData = {
      nodes,
      edges,
    }

    // 导出文件
    const jsonStr = JSON.stringify(store.graphData, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bpmn-data.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return {
    handleImport,
    handleExport,
  }
}

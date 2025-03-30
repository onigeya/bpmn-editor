import type { GraphData } from '../src/stores/bpmnStore'

export const sampleData: GraphData = {
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

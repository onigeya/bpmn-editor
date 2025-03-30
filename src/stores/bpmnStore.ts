import { defineStore } from 'pinia'
import type { Node, Edge } from '@antv/x6'
import type { BpmnDefinitions } from 'bpmn-moddle'
import type { BaseElement } from 'bpmn-moddle'

export interface GraphData {
  nodes?: Node.Metadata[]
  edges?: Edge.Metadata[]
}

export interface DrawerElement {
  id: string
  type: 'node' | 'edge' | 'canvas'
  data?: {
    original?: BaseElement
    [key: string]: unknown
  }
}

export const useBpmnStore = defineStore('bpmn', {
  state: () => ({
    graphData: null as GraphData | null,
    definitions: null as BpmnDefinitions | null,
    // Drawer相关状态
    drawerVisible: false,
    currentElement: {
      id: '',
      type: 'canvas',
      data: undefined,
    } as DrawerElement,
  }),
  actions: {
    // 打开抽屉
    openDrawer(
      type: 'node' | 'edge' | 'canvas',
      id: string,
      data?: {
        original?: BaseElement
        [key: string]: unknown
      },
    ) {
      this.currentElement = { type, id, data }
      this.drawerVisible = true
    },
    // 关闭抽屉
    closeDrawer() {
      this.drawerVisible = false
    },
  },
})

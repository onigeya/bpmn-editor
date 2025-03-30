import { defineStore } from 'pinia'
import type { Node, Edge } from '@antv/x6'
import type { BpmnDefinitions } from 'bpmn-moddle'

export interface GraphData {
  nodes?: Node.Metadata[]
  edges?: Edge.Metadata[]
}

export const useBpmnStore = defineStore('bpmn', {
  state: () => ({
    graphData: null as GraphData | null,
    definitions: null as BpmnDefinitions | null,
  }),
})

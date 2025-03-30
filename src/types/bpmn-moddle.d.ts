declare module 'bpmn-moddle' {
  export interface BaseElement {
    id?: string
    $type: string
    [key: string]: unknown
  }

  export interface BpmnDefinitions extends BaseElement {
    $type: 'bpmn:Definitions'
    rootElements: Array<BpmnProcess | BaseElement>
    diagrams?: Array<BpmnDiagram>
    exporter?: string
    exporterVersion?: string
    targetNamespace?: string
  }

  export interface BpmnProcess extends BaseElement {
    $type: 'bpmn:Process'
    id: string
    isExecutable?: boolean
    flowElements: Array<FlowElement>
  }

  export interface FlowElement extends BaseElement {
    id: string
    name?: string
    sourceRef?: FlowElement
    targetRef?: FlowElement
  }

  export interface BpmnDiagram extends BaseElement {
    $type: 'bpmndi:BPMNDiagram'
    id: string
    plane: BpmnPlane
  }

  export interface BpmnPlane extends BaseElement {
    $type: 'bpmndi:BPMNPlane'
    id: string
    bpmnElement?: BaseElement
    planeElement: Array<PlaneElement>
  }

  export interface PlaneElement extends BaseElement {
    id: string
    bpmnElement: BaseElement
    bounds?: Bounds
    waypoints?: Array<Point>
  }

  export interface Bounds {
    x: number
    y: number
    width: number
    height: number
  }

  export interface Point {
    x: number
    y: number
  }

  export interface FromXMLResult {
    rootElement: BpmnDefinitions
    references: unknown[]
    warnings: { message: string; error?: Error }[]
  }

  export interface ToXMLResult {
    xml: string
  }

  export interface ModdleCreateOptions {
    preamble?: boolean
    format?: boolean
    nsName?: string
    prefix?: string
  }

  export default class BpmnModdle {
    constructor(options?: Record<string, unknown>)

    /**
     * 从XML字符串创建BPMN模型
     */
    fromXML(xmlStr: string): Promise<FromXMLResult>

    /**
     * 将BPMN模型转换为XML字符串
     */
    toXML(element: BaseElement, options?: ModdleCreateOptions): Promise<ToXMLResult>

    /**
     * 创建BPMN元素
     */
    create<T extends BaseElement>(type: string, attrs?: Record<string, unknown>): T
  }
}

declare module 'camunda-bpmn-moddle/resources/camunda.json' {
  const value: Record<string, unknown>
  export default value
}

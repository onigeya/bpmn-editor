import { useBpmnStore, type GraphData } from '../stores/bpmnStore'
import { useGraph } from './useGraph'
import BpmnModdle, {
  type BpmnDefinitions,
  type BpmnProcess,
  type FlowElement,
  type BpmnDiagram,
  type PlaneElement,
  type Point,
  type Bounds,
  type BpmnPlane,
  type BaseElement,
} from 'bpmn-moddle'
import camundaModdle from 'camunda-bpmn-moddle/resources/camunda.json'
import type { Node, Edge } from '@antv/x6'

export const useImportExport = () => {
  const store = useBpmnStore()
  const { getGraph } = useGraph()

  const updateGraphDataFromCanvas = () => {
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
  }

  const handleImport = () => {
    // 创建隐藏的文件输入元素
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.bpmn,.xml'
    input.style.display = 'none'

    // 添加文件选择事件监听
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const xmlContent = e.target?.result as string
        if (xmlContent) {
          parseXmlString(xmlContent)
        }
      }
      reader.readAsText(file)
    }

    // 触发文件选择
    document.body.appendChild(input)
    input.click()
    document.body.removeChild(input)
  }

  const handleExport = async () => {
    try {
      // 更新画布数据到 store
      updateGraphDataFromCanvas()

      // 生成BPMN定义
      const definitions = await convertGraphDataToDefinitions()
      if (!definitions) {
        throw new Error('无法生成BPMN定义')
      }

      // 转换为XML
      const moddle = new BpmnModdle({ camunda: camundaModdle })
      const { xml } = await moddle.toXML(definitions, { format: true })

      // 创建并下载XML文件
      const blob = new Blob([xml], { type: 'application/xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'bpmn-diagram.bpmn'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      return { success: true, xml }
    } catch (error) {
      console.error('导出XML失败:', error)
      return { success: false, error }
    }
  }

  /**
   * 将BPMN定义转换为图形数据
   * @param definitions BPMN定义对象
   */
  const convertDefinitionsToGraphData = (definitions: BpmnDefinitions): GraphData => {
    if (!definitions) return { nodes: [], edges: [] }

    const graphData: GraphData = { nodes: [], edges: [] }

    // 1. 从definitions中获取process
    const process = definitions.rootElements.find(
      (element): element is BpmnProcess => element.$type === 'bpmn:Process',
    )
    if (!process) return graphData

    // 2. 获取图形布局信息
    const diagram = definitions.diagrams?.find(
      (element): element is BpmnDiagram => element.$type === 'bpmndi:BPMNDiagram',
    )
    if (!diagram) return graphData

    const plane = diagram.plane
    if (!plane) return graphData

    const planeElements = plane.planeElement || []

    // 创建布局信息映射表
    const layoutMap = createLayoutMap(planeElements)

    // 3. 处理流程元素
    const flowElements = process.flowElements || []

    // 处理节点和边
    graphData.nodes = convertNodes(flowElements, layoutMap)
    graphData.edges = convertEdges(flowElements)

    return graphData
  }

  /**
   * 创建元素布局映射表
   * @param planeElements 平面元素数组
   */
  const createLayoutMap = (
    planeElements: PlaneElement[],
  ): Map<string, { bounds?: Bounds; waypoints?: Point[] }> => {
    const layoutMap = new Map<string, { bounds?: Bounds; waypoints?: Point[] }>()

    planeElements.forEach((element) => {
      if (element.bpmnElement) {
        layoutMap.set(element.bpmnElement.id || '', {
          bounds: element.bounds,
          waypoints: element.waypoints,
        })
      }
    })

    return layoutMap
  }

  /**
   * 转换BPMN节点为图形节点
   * @param flowElements 流程元素数组
   * @param layoutMap 布局信息映射表
   */
  const convertNodes = (
    flowElements: FlowElement[],
    layoutMap: Map<string, { bounds?: Bounds; waypoints?: Point[] }>,
  ): Node.Metadata[] => {
    return flowElements
      .filter((element) => element.$type !== 'bpmn:SequenceFlow')
      .map((element) => {
        const layout = layoutMap.get(element.id)
        let shape = 'bpmn-task' // 默认形状
        let width = 100 // 默认宽度
        let height = 80 // 默认高度

        // 桩(端口)设置
        let ports = []

        // 统一处理data对象
        const data: Record<string, unknown> = {
          original: element,
        }

        switch (element.$type) {
          case 'bpmn:StartEvent':
          case 'bpmn:EndEvent':
            shape = 'bpmn-event'
            width = 36
            height = 36

            // Event节点四个方向各有一个桩
            ports = [
              { id: 'top', group: 'top' },
              { id: 'right', group: 'right' },
              { id: 'bottom', group: 'bottom' },
              { id: 'left', group: 'left' },
            ]
            break

          case 'bpmn:Task':
          case 'bpmn:UserTask':
          case 'bpmn:ServiceTask':
            // Task节点每个方向上各有三个桩
            ports = [
              // 顶部三个桩
              { id: 'top-left', group: 'top' },
              { id: 'top', group: 'top' },
              { id: 'top-right', group: 'top' },

              // 右侧三个桩
              { id: 'right-top', group: 'right' },
              { id: 'right', group: 'right' },
              { id: 'right-bottom', group: 'right' },

              // 底部三个桩
              { id: 'bottom-left', group: 'bottom' },
              { id: 'bottom', group: 'bottom' },
              { id: 'bottom-right', group: 'bottom' },

              // 左侧三个桩
              { id: 'left-top', group: 'left' },
              { id: 'left', group: 'left' },
              { id: 'left-bottom', group: 'left' },
            ]
            break

          case 'bpmn:ExclusiveGateway':
            shape = 'bpmn-gateway'
            width = 72
            height = 36

            // 网关有四个方向的桩
            ports = [
              { id: 'top-left', group: 'top' },
              { id: 'top', group: 'top' },
              { id: 'top-right', group: 'top' },
              { id: 'right', group: 'right' },
              { id: 'bottom-left', group: 'bottom' },
              { id: 'bottom', group: 'bottom' },
              { id: 'bottom-right', group: 'bottom' },
              { id: 'left', group: 'left' },
            ]
            break

          // 可以添加更多节点类型的处理
          default:
            // 默认每个方向都有一个桩
            ports = [
              { id: 'top', group: 'top' },
              { id: 'right', group: 'right' },
              { id: 'bottom', group: 'bottom' },
              { id: 'left', group: 'left' },
            ]
        }

        // 创建节点
        return {
          id: element.id,
          shape,
          x: layout?.bounds?.x || 0,
          y: layout?.bounds?.y || 0,
          width,
          height,
          ports,
          data,
        }
      })
  }

  /**
   * 转换BPMN边为图形边
   * @param flowElements 流程元素数组
   * @param layoutMap 布局信息映射表
   */
  const convertEdges = (flowElements: FlowElement[]): Edge.Metadata[] => {
    return flowElements
      .filter((element) => element.$type === 'bpmn:SequenceFlow')
      .map((element) => {
        const waypoints: BaseElement[] = []

        // 默认使用中心端口
        let sourcePort = 'right'
        let targetPort = 'left'

        // 根据节点类型选择合适的端口
        const sourceRef = element.sourceRef
        const targetRef = element.targetRef

        if (sourceRef && sourceRef.$type) {
          // 对于Task类型节点，使用右侧中间端口
          if (sourceRef.$type.includes('Task')) {
            sourcePort = 'right'
          }
          // 对于开始事件，使用右侧端口
          else if (sourceRef.$type === 'bpmn:StartEvent') {
            sourcePort = 'right'
          }
          // 对于网关和其他节点，使用最接近目标的方向端口
          else {
            sourcePort = 'right' // 默认使用右侧端口
          }
        }

        if (targetRef && targetRef.$type) {
          // 对于Task类型节点，使用左侧中间端口
          if (targetRef.$type.includes('Task')) {
            targetPort = 'left'
          }
          // 对于结束事件，使用左侧端口
          else if (targetRef.$type === 'bpmn:EndEvent') {
            targetPort = 'left'
          }
          // 对于网关和其他节点，使用最接近源的方向端口
          else {
            targetPort = 'left' // 默认使用左侧端口
          }
        }

        return {
          id: element.id,
          shape: 'edge',
          source: {
            cell: element.sourceRef?.id || '',
            port: sourcePort,
          },
          target: {
            cell: element.targetRef?.id || '',
            port: targetPort,
          },
          router: {
            name: 'manhattan',
          },
          connector: {
            name: 'rounded',
          },
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
          vertices:
            waypoints.length > 0
              ? waypoints.map((point) => ({
                  x: point.x,
                  y: point.y,
                }))
              : undefined,
          data: {
            type: 'sequenceFlow',
            original: element,
          },
        }
      })
  }

  /**
   * 解析XML字符串并存储到store中
   * @param xmlString BPMN XML字符串
   */
  const parseXmlString = async (xmlString: string) => {
    try {
      const moddle = new BpmnModdle({ camunda: camundaModdle })
      const { rootElement: definitions } = await moddle.fromXML(xmlString)

      // 将解析结果保存到store中
      store.definitions = definitions

      // 转换BPMN定义为图形数据并更新store
      const graphData = convertDefinitionsToGraphData(definitions)
      store.graphData = graphData

      return { success: true, definitions, graphData }
    } catch (error) {
      console.error('解析XML失败:', error)
      return { success: false, error }
    }
  }

  /**
   * 将图形数据转换回BPMN定义
   * @returns BPMN定义对象
   */
  const convertGraphDataToDefinitions = async (): Promise<BpmnDefinitions | null> => {
    // 首先获取最新的画布数据
    updateGraphDataFromCanvas()

    if (!store.graphData || !store.definitions) {
      console.error('没有可用的图形数据或BPMN定义')
      return null
    }

    // 创建新的moddle实例
    const moddle = new BpmnModdle({ camunda: camundaModdle })

    // 克隆原始definitions（不包括具体内容）
    const originalDefs = store.definitions

    // 创建新的definitions对象，保留原始definitions的基本属性
    const newDefinitions = moddle.create('bpmn:Definitions', {
      id: originalDefs.id ?? `Definitions_${Math.random().toString(36).substring(2, 9)}`,
      targetNamespace: originalDefs.targetNamespace,
      exporter: originalDefs.exporter || 'BPMN Editor',
      exporterVersion: originalDefs.exporterVersion || '1.0.0',
    }) as BpmnDefinitions

    // 找到原始Process
    const originalProcess = originalDefs.rootElements.find(
      (element): element is BpmnProcess => element.$type === 'bpmn:Process',
    )

    if (!originalProcess) {
      console.error('原始BPMN定义中没有Process元素')
      return null
    }

    // 创建新的Process元素
    const newProcess = moddle.create('bpmn:Process', {
      id: originalProcess.id,
      isExecutable: originalProcess.isExecutable,
    }) as BpmnProcess

    // 将Process添加到definitions中
    newDefinitions.rootElements = [newProcess]

    // 创建新的flowElements数组
    newProcess.flowElements = []

    // 图形元素到BPMN元素的映射
    const nodeMap = new Map<string, FlowElement>()

    // 1. 首先处理所有节点
    for (const node of store.graphData.nodes || []) {
      if (!node.id) continue

      // 获取原始的BPMN元素
      const originalData = node.data?.original as FlowElement
      if (!originalData) continue

      // 创建相同类型的新元素
      const newElement = moddle.create(originalData.$type, {
        id: node.id,
        name: originalData.name ?? '',
        // 复制其他特定属性
        ...(originalData.extensionElements
          ? { extensionElements: originalData.extensionElements }
          : {}),
      }) as FlowElement

      // 保存到映射表和Process中
      nodeMap.set(node.id, newElement)
      newProcess.flowElements.push(newElement)
    }

    // 2. 处理所有边
    for (const edge of store.graphData.edges || []) {
      if (!edge.id) continue

      const source = edge.source as { cell: string; port?: string } | undefined
      const target = edge.target as { cell: string; port?: string } | undefined

      if (!source?.cell || !target?.cell) continue

      // 获取原始的边数据
      const originalData = edge.data?.original as FlowElement

      // 创建新的SequenceFlow
      const sequenceFlow = moddle.create('bpmn:SequenceFlow', {
        id: edge.id,
        name: originalData?.name ?? '',
        sourceRef: nodeMap.get(source.cell),
        targetRef: nodeMap.get(target.cell),
      }) as FlowElement

      // 添加到Process中
      newProcess.flowElements.push(sequenceFlow)
    }

    // 3. 创建BPMN图表元素
    const diagram = moddle.create('bpmndi:BPMNDiagram', {
      id: 'BPMNDiagram_1',
    }) as BpmnDiagram

    // 创建平面
    const plane = moddle.create('bpmndi:BPMNPlane', {
      id: 'BPMNPlane_1',
      bpmnElement: newProcess,
    }) as BpmnPlane

    diagram.plane = plane
    plane.planeElement = []

    // 4. 为每个节点创建形状
    for (const node of store.graphData.nodes || []) {
      if (!node.id) continue

      const bpmnElement = nodeMap.get(node.id)
      if (!bpmnElement) continue

      // 创建节点边界
      const bounds = moddle.create('dc:Bounds', {
        x: node.position?.x ?? node.x ?? 0,
        y: node.position?.y ?? node.y ?? 0,
        width: node.size?.width ?? node.width ?? 100,
        height: node.size?.height ?? node.height ?? 80,
      }) as unknown as Bounds

      // 创建BPMNShape
      const shape = moddle.create('bpmndi:BPMNShape', {
        id: `BPMNShape_${node.id}`,
        bpmnElement,
        bounds,
      }) as PlaneElement

      // 添加到plane中
      plane.planeElement.push(shape)
    }

    // 5. 为每条边创建路径
    for (const edge of store.graphData.edges || []) {
      if (!edge.id) continue

      const source = edge.source as { cell: string; port?: string } | undefined
      const target = edge.target as { cell: string; port?: string } | undefined

      if (!source?.cell || !target?.cell) continue

      // 找到对应的BPMN元素
      const sequenceFlow = newProcess.flowElements.find(
        (element) => element.id === edge.id,
      ) as FlowElement

      if (!sequenceFlow) continue

      // 准备路径点
      const waypoints: BaseElement[] = []

      // 如果有自定义路径点
      if (edge.vertices && edge.vertices.length > 0) {
        for (const point of edge.vertices) {
          waypoints.push(
            moddle.create('dc:Point', {
              x: point.x,
              y: point.y,
            }),
          )
        }
      } else {
        // 如果没有路径点，创建直线
        // 获取源节点和目标节点
        const sourceNode = store.graphData.nodes?.find((n) => n.id === source.cell)
        const targetNode = store.graphData.nodes?.find((n) => n.id === target.cell)

        if (sourceNode && targetNode) {
          // 计算源端口位置
          const sourcePort = source.port || 'right'
          let sourceX = sourceNode.position?.x ?? sourceNode.x ?? 0
          let sourceY = sourceNode.position?.y ?? sourceNode.y ?? 0
          const sourceWidth = sourceNode.size?.width ?? sourceNode.width ?? 0
          const sourceHeight = sourceNode.size?.height ?? sourceNode.height ?? 0

          if (sourcePort.includes('right')) {
            sourceX += sourceWidth
          } else if (sourcePort.includes('bottom')) {
            sourceY += sourceHeight
          }
          sourceY += sourceHeight / 2

          // 计算目标端口位置
          const targetPort = target.port || 'left'
          let targetX = targetNode.position?.x ?? targetNode.x ?? 0
          let targetY = targetNode.position?.y ?? targetNode.y ?? 0
          const targetWidth = targetNode.size?.width ?? targetNode.width ?? 0
          const targetHeight = targetNode.size?.height ?? targetNode.height ?? 0

          if (targetPort.includes('right')) {
            targetX += targetWidth
          } else if (targetPort.includes('bottom')) {
            targetY += targetHeight
          }
          targetY += targetHeight / 2

          // 添加起点和终点
          waypoints.push(
            moddle.create('dc:Point', { x: sourceX, y: sourceY }),
            moddle.create('dc:Point', { x: targetX, y: targetY }),
          )
        }
      }

      // 创建BPMNEdge
      const bpmnEdge = moddle.create('bpmndi:BPMNEdge', {
        id: `BPMNEdge_${edge.id}`,
        bpmnElement: sequenceFlow,
        waypoint: waypoints,
      }) as PlaneElement

      // 添加到plane中
      plane.planeElement.push(bpmnEdge)
    }

    // 添加diagram到definitions
    newDefinitions.diagrams = [diagram]

    // 更新store中的definitions
    store.definitions = newDefinitions

    return newDefinitions
  }

  return {
    handleImport,
    handleExport,
    updateGraphDataFromCanvas,
    parseXmlString,
    convertDefinitionsToGraphData,
    convertGraphDataToDefinitions,
  }
}

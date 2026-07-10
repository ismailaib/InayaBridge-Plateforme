"use client"

import { createContext, useContext } from "react"
import type { Node, Edge } from "reactflow"

type FlowContextType = {
  nodes: Node[]
  edges: Edge[]
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
  organizeNodes: () => void
  importFlow: (data: any) => void
  exportFlow: () => void
}

export const FlowContext = createContext<FlowContextType | null>(null)
export const useFlow = () => {
  const ctx = useContext(FlowContext)
  if (!ctx) throw new Error("useFlow must be used within FlowProvider")
  return ctx
}

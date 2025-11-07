import { useState, useCallback } from "react";
import { Node, useNodesState, Edge } from "reactflow";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "custom",
    position: { x: 250, y: 150 },
    data: { id: "1", title: "Start Node", label: "Schema Start Here!", description: "Schema Start Here!", fields: [] },
  },
];

export function useFlowNodes(setEdges?: React.Dispatch<React.SetStateAction<Edge[]>>) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const deleteNode = useCallback(
    (id: string) => {
      if (id === "1") return;

      setNodes((nds) => nds.filter((n) => n.id !== id));
      if (setEdges) {
        setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
      }
      setSelectedNodeId((cur) => (cur === id ? null : cur));
    },
    [setNodes, setEdges]
  );

  const updateNodeData = useCallback(
    (nodeId: string, data: any) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
        )
      );
    },
    [setNodes]
  );

  return {
    nodes,
    setNodes,
    onNodesChange,
    selectedNodeId,
    setSelectedNodeId,
    deleteNode,
    updateNodeData,
  };
}

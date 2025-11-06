import { useState, useCallback } from "react";
import { Node, useNodesState } from "reactflow";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "custom",
    position: { x: 250, y: 150 },
    data: { id: "1", title: "Start Node", label: "Schema Start Here!", fields: [] },
  },
];

export function useFlowNodes() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const deleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== id));
      setSelectedNodeId((cur) => (cur === id ? null : cur));
    },
    [setNodes]
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

  return { nodes, setNodes, onNodesChange, selectedNodeId, setSelectedNodeId, deleteNode, updateNodeData };
}

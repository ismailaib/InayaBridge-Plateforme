import { useEdgesState, addEdge, Connection, Edge } from "reactflow";

export function useFlowEdges() {
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = (params: Connection) => {
    if (!params.source || !params.target || params.source === params.target) return;

    setEdges((eds) => {
      const sourceHasEdge = eds.some((e) => e.source === params.source);
      const targetHasEdge = eds.some((e) => e.target === params.target);
      if (sourceHasEdge || targetHasEdge) return eds;
      return addEdge({ ...params, type: "smoothstep" }, eds);
    });
  };

  return { edges, setEdges, onEdgesChange, onConnect };
}
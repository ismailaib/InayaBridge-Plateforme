import { useState, useCallback } from "react";
import {
  addEdge,
  Connection,
  Edge,
  EdgeChange,
  applyEdgeChanges,
} from "reactflow";

export function useFlowEdges() {
  const [edges, setEdges] = useState<Edge[]>([]);

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    []
  );

  const onConnect = useCallback((params: Connection) => {
    if (!params.source || !params.target || params.source === params.target) return;

    setEdges((eds) => {
      const sourceHasEdge = eds.some((e) => e.source === params.source);
      const targetHasEdge = eds.some((e) => e.target === params.target);
      if (sourceHasEdge || targetHasEdge) return eds;
      return addEdge({ ...params, type: "smoothstep" }, eds);
    });
  }, []);

  const onEdgesDelete = useCallback((deletedEdges: Edge[]) => {
    setEdges((eds) => eds.filter((e) => !deletedEdges.some((d) => d.id === e.id)));
  }, []);

  return { edges, setEdges, onEdgesChange, onConnect, onEdgesDelete };
}

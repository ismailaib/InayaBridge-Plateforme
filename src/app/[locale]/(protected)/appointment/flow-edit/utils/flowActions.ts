import { ReactFlowInstance, Node, Edge } from "reactflow";
import { Dispatch, SetStateAction } from "react";
import {
  addNewNode,
  addNodeFromTemplate,
  createDefaultFlow,
  fetchUserFlows,
  importFlow,
  exportFlow,
  loadFlowToNodesEdges,
  organizeNodes,
} from "./flowHelpers";
import { saveFlowTemplate } from "./flowStorage";
import { deleteFlowTemplate } from "@/api/flow";

export interface FlowState {
  flows: any[];
  groupedFlows: { [groupId: string]: any[] };
  selectedFlow: any | null;
  nodes: Node[];
  edges: Edge[];
}

export interface FlowActions {
  setFlows: Dispatch<SetStateAction<any[]>>;
  setGroupedFlows: Dispatch<SetStateAction<{ [groupId: string]: any[] }>>;
  setSelectedFlow: Dispatch<SetStateAction<any>>;
  setNodes: Dispatch<SetStateAction<Node[]>>;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  setSelectedNodeId: (id: string) => void;
  deleteNode: (id: string) => void;
  rfInstance: ReactFlowInstance | null;
}

export const loadInitialFlows = async (actions: FlowActions, setIsCreating: (val: boolean) => void) => {
  const { setFlows, setGroupedFlows, setSelectedFlow, setNodes, setEdges, deleteNode } = actions;
  
  const fetchedFlows = await fetchUserFlows();
  const groups = groupFlowsByGroupId(fetchedFlows);
  
  setFlows(fetchedFlows);
  setGroupedFlows(groups);

  if (fetchedFlows.length === 0) {
    setIsCreating(true);
    const start = Date.now();
    await createDefaultFlow();
    const elapsed = Date.now() - start;
    await new Promise(resolve => setTimeout(resolve, Math.max(0, 5000 - elapsed)));
    
    const newFlows = await fetchUserFlows();
    const newGroups = groupFlowsByGroupId(newFlows);
    
    setFlows(newFlows);
    setGroupedFlows(newGroups);
    
    if (newFlows.length > 0) {
      const latest = newFlows[newFlows.length - 1];
      loadFlow(latest, setSelectedFlow, setNodes, setEdges, deleteNode);
    }
    setIsCreating(false);
  } else {
    const latest = getLatestFlowFromGroups(groups);
    loadFlow(latest, setSelectedFlow, setNodes, setEdges, deleteNode);
  }
};

export const handleAddNode = (actions: FlowActions) => {
  const { rfInstance, setNodes, setSelectedNodeId, deleteNode } = actions;
  addNewNode(rfInstance, setNodes, setSelectedNodeId as Dispatch<SetStateAction<string>>, deleteNode);
};

export const handleAddFromTemplate = (template: any, actions: FlowActions) => {
  const { rfInstance, setNodes, setSelectedNodeId, deleteNode } = actions;
  addNodeFromTemplate(template, rfInstance, setNodes, setSelectedNodeId as Dispatch<SetStateAction<string | null>>, deleteNode);
};

export const handleSave = async (state: FlowState, actions: FlowActions) => {
  const { nodes, selectedFlow } = state;
  const { setFlows, setGroupedFlows, setSelectedFlow } = actions;
  
  try {
    const saved = await saveFlowTemplate(nodes, selectedFlow?.id, selectedFlow?.name);
    if (saved) {
      const newFlows = await fetchUserFlows();
      const newGroups = groupFlowsByGroupId(newFlows);
      
      setFlows(newFlows);
      setGroupedFlows(newGroups);
      
      const latest = newFlows[newFlows.length - 1];
      setSelectedFlow(latest);
    }
  } catch (err) {
    console.error("Save failed", err);
  }
};

export const handleOrganize = (actions: FlowActions) => {
  organizeNodes(actions.setNodes);
};

export const handleImport = (data: any, actions: FlowActions) => {
  const { setNodes, setEdges, deleteNode } = actions;
  importFlow(data, setNodes, setEdges, deleteNode);
};

export const handleExport = (state: FlowState) => {
  const { nodes, edges } = state;
  exportFlow(nodes, edges);
};

export const handlePrevGroup = (state: FlowState, actions: FlowActions) => {
  const { groupedFlows, selectedFlow } = state;
  const { setSelectedFlow, setNodes, setEdges, deleteNode } = actions;
  
  const groups = Object.keys(groupedFlows).sort(
    (a, b) => groupedFlows[b][0].createdAt - groupedFlows[a][0].createdAt
  );
  const currentIndex = groups.findIndex(g => g === selectedFlow?.groupId);
  
  if (currentIndex > 0) {
    const prevGroupId = groups[currentIndex - 1];
    const prevGroup = groupedFlows[prevGroupId];
    const prev = prevGroup.sort((a, b) => b.version - a.version)[0];
    
    loadFlow(prev, setSelectedFlow, setNodes, setEdges, deleteNode);
  }
};

export const handleNextGroup = (state: FlowState, actions: FlowActions) => {
  const { groupedFlows, selectedFlow } = state;
  const { setSelectedFlow, setNodes, setEdges, deleteNode } = actions;
  
  const groups = Object.keys(groupedFlows).sort(
    (a, b) => groupedFlows[b][0].createdAt - groupedFlows[a][0].createdAt
  );
  const currentIndex = groups.findIndex(g => g === selectedFlow?.groupId);
  
  if (currentIndex < groups.length - 1) {
    const nextGroupId = groups[currentIndex + 1];
    const nextGroup = groupedFlows[nextGroupId];
    const next = nextGroup.sort((a, b) => b.version - a.version)[0];
    
    loadFlow(next, setSelectedFlow, setNodes, setEdges, deleteNode);
  }
};

export const handleSelectFlow = (flow: any, actions: FlowActions) => {
  const { setSelectedFlow, setNodes, setEdges, deleteNode } = actions;
  loadFlow(flow, setSelectedFlow, setNodes, setEdges, deleteNode);
};

export const handleFlowUpdate = (updatedFlow: any, state: FlowState, actions: FlowActions) => {
  const { flows, selectedFlow } = state;
  const { setFlows, setGroupedFlows, setSelectedFlow } = actions;
  
  const newFlows = flows.map(f =>
    f.groupId === updatedFlow.groupId
      ? { ...f, name: updatedFlow.name }
      : f
  );

  const newGroups = groupFlowsByGroupId(newFlows);
  
  setFlows(newFlows);
  setGroupedFlows(newGroups);

  if (selectedFlow?.groupId === updatedFlow.groupId) {
    setSelectedFlow({ ...selectedFlow, name: updatedFlow.name });
  }
};

export const handleCreateNew = async (actions: FlowActions) => {
  const { setFlows, setGroupedFlows, setSelectedFlow, setNodes, setEdges, deleteNode } = actions;
  
  await createDefaultFlow();
  const newFlows = await fetchUserFlows();
  const newGroups = groupFlowsByGroupId(newFlows);
  
  setFlows(newFlows);
  setGroupedFlows(newGroups);
  
  const latest = newFlows[newFlows.length - 1];
  loadFlow(latest, setSelectedFlow, setNodes, setEdges, deleteNode);
};

export const handleDeleteFlow = async (flow: any, state: FlowState, actions: FlowActions) => {
  const { flows } = state;
  const { setFlows, setGroupedFlows, setSelectedFlow, setNodes, setEdges, deleteNode } = actions;
  
  try {
    await deleteFlowTemplate(flow.id);

    const groupIdToRemove = flow.groupId || flow.id;
    const updated = flows.filter(f => f.groupId !== groupIdToRemove && f.id !== groupIdToRemove);
    const updatedGroups = groupFlowsByGroupId(updated);

    setFlows(updated);
    setGroupedFlows(updatedGroups);

    if (updated.length > 0) {
      const latest = getLatestFlowFromGroups(updatedGroups);
      loadFlow(latest, setSelectedFlow, setNodes, setEdges, deleteNode);
    } else {
      setSelectedFlow(null);
      setNodes([]);
      setEdges([]);
    }
  } catch (err) {
    console.error("Delete failed:", err);
  }
};

// Helper functions
const groupFlowsByGroupId = (flows: any[]): { [groupId: string]: any[] } => {
  const groups: { [groupId: string]: any[] } = {};
  flows.forEach(flow => {
    const groupId = flow.groupId || flow.id;
    if (!groups[groupId]) groups[groupId] = [];
    groups[groupId].push(flow);
  });
  return groups;
};

const getLatestFlowFromGroups = (groups: { [groupId: string]: any[] }): any => {
  const latestGroupId = Object.keys(groups)[Object.keys(groups).length - 1];
  const latestGroup = groups[latestGroupId];
  return latestGroup.sort((a, b) => b.version - a.version)[0];
};

const loadFlow = (
  flow: any,
  setSelectedFlow: Dispatch<SetStateAction<any>>,
  setNodes: Dispatch<SetStateAction<Node[]>>,
  setEdges: Dispatch<SetStateAction<Edge[]>>,
  deleteNode: (id: string) => void
) => {
  setSelectedFlow(flow);
  const { nodes: loadedNodes, edges: loadedEdges } = loadFlowToNodesEdges(flow, deleteNode);
  setNodes(loadedNodes);
  setEdges(loadedEdges);
  organizeNodes(setNodes);
};
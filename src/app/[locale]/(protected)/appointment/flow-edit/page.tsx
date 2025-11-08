"use client";

import React, { useState, useMemo, useCallback, createContext, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";

import CustomNode from "./components/CustomNode";
import FlowSidebar from "./sidebar/FlowSidebar";
import FlowHeader from "./Header/FlowHeader";

import { useFlowNodes } from "./hooks/useFlowNodes";
import { useFlowEdges } from "./hooks/useFlowEdges";
import {
  addNewNode,
  addNodeFromTemplate,
  createDefaultFlow,
  fetchUserFlows,
  importFlow,
  exportFlow,
  loadFlowToNodesEdges,
  organizeNodes,
} from "./utils/flowHelpers";
import { saveFlowTemplate } from "./utils/flowStorage";
import { deleteFlowTemplate } from "@/api/flow";

const nodeTypes = { custom: CustomNode };

export const ApercuContext = createContext<boolean>(true);

export default function FlowEditor() {
  const { edges, setEdges, onEdgesChange, onConnect } = useFlowEdges();
  const {
    nodes,
    setNodes,
    onNodesChange,
    selectedNodeId,
    setSelectedNodeId,
    deleteNode,
    updateNodeData,
  } = useFlowNodes(setEdges);

  const [flows, setFlows] = useState<any[]>([]);
  const [groupedFlows, setGroupedFlows] = useState<{ [groupId: string]: any[] }>({});
  const [selectedFlow, setSelectedFlow] = useState<any>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [showApercu, setShowApercu] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || null,
    [nodes, selectedNodeId]
  );

  useEffect(() => {
    const load = async () => {
      const fetchedFlows = await fetchUserFlows();
      const groups: { [groupId: string]: any[] } = {};
      fetchedFlows.forEach(flow => {
        const groupId = flow.groupId || flow.id;
        if (!groups[groupId]) groups[groupId] = [];
        groups[groupId].push(flow);
      });
      setFlows(fetchedFlows);
      setGroupedFlows(groups);

      if (fetchedFlows.length === 0) {
        setIsCreating(true);
        const start = Date.now();
        await createDefaultFlow();
        const elapsed = Date.now() - start;
        await new Promise(resolve => setTimeout(resolve, Math.max(0, 5000 - elapsed)));
        const newFlows = await fetchUserFlows();
        const newGroups: { [groupId: string]: any[] } = {};
        newFlows.forEach(flow => {
          const groupId = flow.groupId || flow.id;
          if (!newGroups[groupId]) newGroups[groupId] = [];
          newGroups[groupId].push(flow);
        });
        setFlows(newFlows);
        setGroupedFlows(newGroups);
        if (newFlows.length > 0) {
          const latest = newFlows[newFlows.length - 1];
          setSelectedFlow(latest);
          const { nodes: loadedNodes, edges: loadedEdges } = loadFlowToNodesEdges(latest, deleteNode);
          setNodes(loadedNodes);
          setEdges(loadedEdges);
          organizeNodes(setNodes);
        }
        setIsCreating(false);
      } else {
        const latestGroupId = Object.keys(groups)[Object.keys(groups).length - 1];
        const latestGroup = groups[latestGroupId];
        const latest = latestGroup.sort((a, b) => b.version - a.version)[0];
        setSelectedFlow(latest);
        const { nodes: loadedNodes, edges: loadedEdges } = loadFlowToNodesEdges(latest, deleteNode);
        setNodes(loadedNodes);
        setEdges(loadedEdges);
        organizeNodes(setNodes);
      }
    };

    load();
  }, []);

  const handleAddNode = useCallback(() => {
    addNewNode(rfInstance, setNodes, setSelectedNodeId, deleteNode);
  }, [rfInstance, setNodes, setSelectedNodeId, deleteNode]);

  const handleAddFromTemplate = useCallback(
    (template: any) =>
      addNodeFromTemplate(
        template,
        rfInstance,
        setNodes,
        setSelectedNodeId,
        deleteNode
      ),
    [rfInstance, setNodes, setSelectedNodeId, deleteNode]
  );

  const handleShowApercu = useCallback(() => setShowApercu(true), []);
  const handleHideApercu = useCallback(() => setShowApercu(false), []);

  const handleSave = useCallback(async () => {
    try {
      const saved = await saveFlowTemplate(nodes, selectedFlow?.id, selectedFlow?.name);
      if (saved) {
        const newFlows = await fetchUserFlows();
        const newGroups: { [groupId: string]: any[] } = {};
        newFlows.forEach(flow => {
          const groupId = flow.groupId || flow.id;
          if (!newGroups[groupId]) newGroups[groupId] = [];
          newGroups[groupId].push(flow);
        });
        setFlows(newFlows);
        setGroupedFlows(newGroups);
        const latest = newFlows[newFlows.length - 1];
        setSelectedFlow(latest);
      }
    } catch (err) {
      console.error("Save failed", err);
    }
  }, [nodes, selectedFlow]);

  const handleOrganize = useCallback(() => {
    organizeNodes(setNodes);
  }, [setNodes]);

  const handleImport = useCallback(
    (data: any) => importFlow(data, setNodes, setEdges, deleteNode),
    [setNodes, setEdges, deleteNode]
  );

  const handleExport = useCallback(() => {
    exportFlow(nodes, edges);
  }, [nodes, edges]);

  const handlePrevGroup = useCallback(() => {
    const groups = Object.keys(groupedFlows).sort((a, b) => groupedFlows[b][0].createdAt - groupedFlows[a][0].createdAt);
    const currentIndex = groups.findIndex(g => g === selectedFlow?.groupId);
    if (currentIndex > 0) {
      const prevGroupId = groups[currentIndex - 1];
      const prevGroup = groupedFlows[prevGroupId];
      const prev = prevGroup.sort((a, b) => b.version - a.version)[0];
      setSelectedFlow(prev);
      const { nodes: loadedNodes, edges: loadedEdges } = loadFlowToNodesEdges(prev, deleteNode);
      setNodes(loadedNodes);
      setEdges(loadedEdges);
      organizeNodes(setNodes);
    }
  }, [groupedFlows, selectedFlow, setNodes, setEdges, deleteNode]);

  const handleNextGroup = useCallback(() => {
    const groups = Object.keys(groupedFlows).sort((a, b) => groupedFlows[b][0].createdAt - groupedFlows[a][0].createdAt);
    const currentIndex = groups.findIndex(g => g === selectedFlow?.groupId);
    if (currentIndex < groups.length - 1) {
      const nextGroupId = groups[currentIndex + 1];
      const nextGroup = groupedFlows[nextGroupId];
      const next = nextGroup.sort((a, b) => b.version - a.version)[0];
      setSelectedFlow(next);
      const { nodes: loadedNodes, edges: loadedEdges } = loadFlowToNodesEdges(next, deleteNode);
      setNodes(loadedNodes);
      setEdges(loadedEdges);
      organizeNodes(setNodes);
    }
  }, [groupedFlows, selectedFlow, setNodes, setEdges, deleteNode]);

  const handleSelectFlow = useCallback((flow: any) => {
    setSelectedFlow(flow);
    const { nodes: loadedNodes, edges: loadedEdges } = loadFlowToNodesEdges(flow, deleteNode);
    setNodes(loadedNodes);
    setEdges(loadedEdges);
    organizeNodes(setNodes);
  }, [setNodes, setEdges, deleteNode]);

  const handleCreateNew = useCallback(async () => {
    await createDefaultFlow();
    const newFlows = await fetchUserFlows();
    const newGroups: { [groupId: string]: any[] } = {};
    newFlows.forEach(flow => {
      const groupId = flow.groupId || flow.id;
      if (!newGroups[groupId]) newGroups[groupId] = [];
      newGroups[groupId].push(flow);
    });
    setFlows(newFlows);
    setGroupedFlows(newGroups);
    const latest = newFlows[newFlows.length - 1];
    setSelectedFlow(latest);
    const { nodes: loadedNodes, edges: loadedEdges } = loadFlowToNodesEdges(latest, deleteNode);
    setNodes(loadedNodes);
    setEdges(loadedEdges);
    organizeNodes(setNodes);
  }, [setNodes, setEdges, deleteNode]);

  const handleNodeClick = useCallback(
    (_: any, node: any) => {
      if (selectedNodeId !== node.id) setSelectedNodeId(node.id);
    },
    [selectedNodeId, setSelectedNodeId]
  );
  const handleDeleteFlow = useCallback(
    async (flow: any) => {
      try {
        await deleteFlowTemplate(flow.id);

        // Remove all templates that share the same groupId as the deleted one
        const groupIdToRemove = flow.groupId || flow.id;
        const updated = flows.filter(f => f.groupId !== groupIdToRemove && f.id !== groupIdToRemove);

        // Rebuild grouped flows
        const updatedGroups: { [groupId: string]: any[] } = {};
        updated.forEach(f => {
          const gid = f.groupId || f.id;
          if (!updatedGroups[gid]) updatedGroups[gid] = [];
          updatedGroups[gid].push(f);
        });

        setFlows(updated);
        setGroupedFlows(updatedGroups);

        // Auto-select latest remaining flow (if any)
        if (updated.length > 0) {
          const latestGroupId = Object.keys(updatedGroups)[Object.keys(updatedGroups).length - 1];
          const latestGroup = updatedGroups[latestGroupId];
          const latest = latestGroup.sort((a, b) => b.version - a.version)[0];
          setSelectedFlow(latest);

          const { nodes: loadedNodes, edges: loadedEdges } = loadFlowToNodesEdges(latest, deleteNode);
          setNodes(loadedNodes);
          setEdges(loadedEdges);
          organizeNodes(setNodes);
        } else {
          setSelectedFlow(null);
          setNodes([]);
          setEdges([]);
        }
      } catch (err) {
        console.error("Delete failed:", err);
      }
    },
    [flows, setFlows, setGroupedFlows, deleteNode, setNodes, setEdges]
  );



  return (
    <div className="h-full w-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <FlowHeader
        flows={flows}
        groupedFlows={groupedFlows}
        nodes={nodes}
        selectedFlow={selectedFlow}
        onSelectFlow={handleSelectFlow}
        organizeNodes={handleOrganize}
        onShowPreview={handleShowApercu}
        onHidePreview={handleHideApercu}
        onSave={handleSave}
        isPreviewVisible={showApercu}
        onPrevGroup={handlePrevGroup}
        onNextGroup={handleNextGroup}
        onCreateNew={handleCreateNew}
        onImport={handleImport}
        onExport={handleExport}
        handleDeleteFlow={handleDeleteFlow}
      />

      <div className="flex flex-1 relative">
        <FlowSidebar
          node={selectedNode}
          onAddNode={handleAddNode}
          onAddNodeFromTemplate={handleAddFromTemplate}
          onNodeDataChange={updateNodeData}
        />

        <div className="flex-1">
          <ApercuContext.Provider value={showApercu}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              onInit={setRfInstance}
              onNodeClick={handleNodeClick}
              fitView
            >
              <MiniMap />
              <Controls />
              <Background gap={12} />
            </ReactFlow>
          </ApercuContext.Provider>
        </div>

        {isCreating && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75">
            <p className="text-lg font-semibold">flux en cours de creation</p>
          </div>
        )}
      </div>
    </div>
  );
}
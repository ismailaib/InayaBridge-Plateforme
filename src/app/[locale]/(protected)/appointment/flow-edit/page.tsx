/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  loadInitialFlows,
  handleAddNode,
  handleAddFromTemplate,
  handleSave,
  handleOrganize,
  handleImport,
  handleExport,
  handlePrevGroup,
  handleNextGroup,
  handleSelectFlow,
  handleFlowUpdate,
  handleCreateNew,
  handleDeleteFlow,
  FlowActions,
  FlowState,
} from "./utils/flowActions";

const nodeTypes = { custom: CustomNode };
export const ApercuContext = React.createContext<boolean>(true);

export default function FlowEditor() {
  const { edges, setEdges, onEdgesChange, onConnect, onEdgesDelete } = useFlowEdges();
  const { nodes, setNodes, onNodesChange, selectedNodeId, setSelectedNodeId, deleteNode, updateNodeData } = useFlowNodes(setEdges);

  const [flows, setFlows] = useState<any[]>([]);
  const [groupedFlows, setGroupedFlows] = useState<{ [groupId: string]: any[] }>({});
  const [selectedFlow, setSelectedFlow] = useState<any>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [showApercu, setShowApercu] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unsaved, setUnsaved] = useState(false);

  // Track the last saved state
  const savedStateRef = useRef<string | null>(null);

  const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedNodeId) || null, [nodes, selectedNodeId]);

  const state: FlowState = { flows, groupedFlows, selectedFlow, nodes, edges };
  const actions: FlowActions = { setFlows, setGroupedFlows, setSelectedFlow, setNodes, setEdges, setSelectedNodeId, deleteNode, rfInstance };

  // Helper function to create a clean snapshot of current state
  const createStateSnapshot = useCallback(() => {
    const cleanNodes = nodes.map(({ id, type, position, data }) => ({
      id,
      type,
      position: { x: Math.round(position.x), y: Math.round(position.y) }, // Round positions to avoid float precision issues
      data: {
        title: data.title,
        fields: data.fields,
        description: data.description,
      },
    }));
    
    const cleanEdges = edges.map(({ id, source, target, type, animated }) => ({
      id,
      source,
      target,
      type,
      animated,
    }));
    
    return JSON.stringify({ nodes: cleanNodes, edges: cleanEdges });
  }, [nodes, edges]);

  // Initial load
  useEffect(() => {
    const load = async () => {
      await loadInitialFlows(actions, setIsCreating);
      setTimeout(() => setLoading(false), 1000);
    };
    load();
  }, []);

  // Save initial state when flow is loaded or after save
  useEffect(() => {
    if (!loading && selectedFlow && nodes.length > 0) {
      savedStateRef.current = createStateSnapshot();
      setUnsaved(false);
    }
  }, [selectedFlow?.id, loading]); // Only run when flow changes or loading completes

  // Detect changes by comparing current state to saved state
  useEffect(() => {
    if (!savedStateRef.current || loading) return;

    const currentSnapshot = createStateSnapshot();
    const hasChanges = currentSnapshot !== savedStateRef.current;
    
    setUnsaved(hasChanges);
  }, [nodes, edges, createStateSnapshot, loading]);

  // Browser warning before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsaved) {
        e.preventDefault();
        e.returnValue = "Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter?";
      }
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [unsaved]);

  // Save handler - updates saved state after successful save
  const handleSaveFlow = async () => {
    await handleSave(state, actions);
    savedStateRef.current = createStateSnapshot();
    setUnsaved(false);
  };

  const onAddNode = useCallback(() => handleAddNode(actions), [rfInstance, setNodes, setSelectedNodeId, deleteNode]);
  const onAddFromTemplate = useCallback((template: any) => handleAddFromTemplate(template, actions), [rfInstance, setNodes, setSelectedNodeId, deleteNode]);
  const onShowApercu = useCallback(() => setShowApercu(true), []);
  const onHideApercu = useCallback(() => setShowApercu(false), []);
  const onOrganize = useCallback(() => handleOrganize(state, actions), [nodes, edges, setNodes]);
  const onImport = useCallback((data: any) => handleImport(data, actions), [setNodes, setEdges, deleteNode]);
  const onExport = useCallback(() => handleExport(state), [nodes, edges]);
  const onPrevGroup = useCallback(() => handlePrevGroup(state, actions), [groupedFlows, selectedFlow, setNodes, setEdges, deleteNode]);
  const onNextGroup = useCallback(() => handleNextGroup(state, actions), [groupedFlows, selectedFlow, setNodes, setEdges, deleteNode]);
  const onSelectFlow = useCallback((flow: any) => handleSelectFlow(flow, actions), [setNodes, setEdges, deleteNode]);
  const onFlowUpdate = useCallback((updatedFlow: any) => handleFlowUpdate(updatedFlow, state, actions), [flows, selectedFlow]);
  const onCreateNew = useCallback(async () => await handleCreateNew(actions), [setNodes, setEdges, deleteNode]);
  const onNodeClick = useCallback((_: any, node: any) => {
    if (selectedNodeId !== node.id) setSelectedNodeId(node.id);
  }, [selectedNodeId, setSelectedNodeId]);
  const onDeleteFlow = useCallback(async (flow: any) => await handleDeleteFlow(flow, state, actions), [flows, setFlows, setGroupedFlows, deleteNode, setNodes, setEdges]);

  return (
    <div className="h-full w-full relative bg-gray-50 dark:bg-gray-950">
      <AnimatePresence>
        {loading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-950 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-lg font-semibold">Chargement...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-full w-full flex flex-col overflow-hidden"
        >
          {/* Unsaved changes banner */}
          <AnimatePresence>
            {unsaved && (
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-gray-100 dark:bg-gray-900/20 text-gray-900 backdrop-blur-md dark:text-gray-100  px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Modifications non enregistrées</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{ y: -50 }} animate={{ y: 0 }} transition={{ duration: 0.8 }} className="z-10">
            <FlowHeader
              flows={flows}
              groupedFlows={groupedFlows}
              nodes={nodes}
              selectedFlow={selectedFlow}
              onSelectFlow={onSelectFlow}
              onFlowUpdate={onFlowUpdate}
              organizeNodes={onOrganize}
              onShowPreview={onShowApercu}
              onHidePreview={onHideApercu}
              onSave={handleSaveFlow}
              isPreviewVisible={showApercu}
              onPrevGroup={onPrevGroup}
              onNextGroup={onNextGroup}
              onCreateNew={onCreateNew}
              onImport={onImport}
              onExport={onExport}
              handleDeleteFlow={onDeleteFlow}
              unsaved={unsaved}
            />
          </motion.div>

          <div className="flex flex-1 relative overflow-hidden">
            <motion.div initial={{ x: -400 }} animate={{ x: 0 }} transition={{ duration: 1, ease: "easeInOut" }}>
              <FlowSidebar
                node={selectedNode}
                onAddNode={onAddNode}
                onAddNodeFromTemplate={onAddFromTemplate}
                onNodeDataChange={updateNodeData}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="flex-1 dark:bg-gray-900">
              <ApercuContext.Provider value={showApercu}>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onEdgesDelete={onEdgesDelete}
                  onConnect={onConnect}
                  nodeTypes={nodeTypes}
                  onInit={setRfInstance}
                  onNodeClick={onNodeClick}
                  deleteKeyCode={["Delete", "Backspace"]}
                  fitView
                >
                  <MiniMap />
                  <Controls />
                  <Background gap={12} />
                </ReactFlow>
              </ApercuContext.Provider>
            </motion.div>

            {isCreating && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 z-40">
                <p className="text-lg font-semibold">Flux en cours de création</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
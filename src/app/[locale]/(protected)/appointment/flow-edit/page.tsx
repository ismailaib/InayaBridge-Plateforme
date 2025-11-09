"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
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
  const [loading, setLoading] = useState(true); // <-- loading state

  const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedNodeId) || null, [nodes, selectedNodeId]);

  // Create state and actions objects
  const state: FlowState = { flows, groupedFlows, selectedFlow, nodes, edges };
  const actions: FlowActions = { setFlows, setGroupedFlows, setSelectedFlow, setNodes, setEdges, setSelectedNodeId, deleteNode, rfInstance };

  // Load initial flows on mount
  useEffect(() => {
    const load = async () => {
      await loadInitialFlows(actions, setIsCreating);
      setTimeout(() => setLoading(false), 1000); // show 1 sec loading
    };
    load();
  }, []);

  const onAddNode = useCallback(() => handleAddNode(actions), [rfInstance, setNodes, setSelectedNodeId, deleteNode]);
  const onAddFromTemplate = useCallback((template: any) => handleAddFromTemplate(template, actions), [rfInstance, setNodes, setSelectedNodeId, deleteNode]);
  const onShowApercu = useCallback(() => setShowApercu(true), []);
  const onHideApercu = useCallback(() => setShowApercu(false), []);
  const onSave = useCallback(async () => await handleSave(state, actions), [nodes, selectedFlow]);
  const onOrganize = useCallback(() => handleOrganize(actions), [setNodes]);
  const onImport = useCallback((data: any) => handleImport(data, actions), [setNodes, setEdges, deleteNode]);
  const onExport = useCallback(() => handleExport(state), [nodes, edges]);
  const onPrevGroup = useCallback(() => handlePrevGroup(state, actions), [groupedFlows, selectedFlow, setNodes, setEdges, deleteNode]);
  const onNextGroup = useCallback(() => handleNextGroup(state, actions), [groupedFlows, selectedFlow, setNodes, setEdges, deleteNode]);
  const onSelectFlow = useCallback((flow: any) => handleSelectFlow(flow, actions), [setNodes, setEdges, deleteNode]);
  const onFlowUpdate = useCallback((updatedFlow: any) => handleFlowUpdate(updatedFlow, state, actions), [flows, selectedFlow]);
  const onCreateNew = useCallback(async () => await handleCreateNew(actions), [setNodes, setEdges, deleteNode]);
  const onNodeClick = useCallback((_: any, node: any) => { if (selectedNodeId !== node.id) setSelectedNodeId(node.id); }, [selectedNodeId, setSelectedNodeId]);
  const onDeleteFlow = useCallback(async (flow: any) => await handleDeleteFlow(flow, state, actions), [flows, setFlows, setGroupedFlows, deleteNode, setNodes, setEdges]);

  return (
    <div className="h-full w-full relative bg-gray-50 dark:bg-gray-950">
      <AnimatePresence>
        {loading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-950"
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
              onSave={onSave}
              isPreviewVisible={showApercu}
              onPrevGroup={onPrevGroup}
              onNextGroup={onNextGroup}
              onCreateNew={onCreateNew}
              onImport={onImport}
              onExport={onExport}
              handleDeleteFlow={onDeleteFlow}
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
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75">
                <p className="text-lg font-semibold">flux en cours de creation</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useMemo, useCallback } from "react";
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
  organizeNodes,
  importFlow,
  exportFlow,
  previewFlow,
} from "./utils/flowHelpers";
import { saveFlowTemplate } from "./utils/flowStorage";

const nodeTypes = { custom: CustomNode };

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

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || null,
    [nodes, selectedNodeId]
  );

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

  const handlePreview = useCallback(() => {
    previewFlow(rfInstance);
  }, [rfInstance]);

  const handleSave = useCallback(async () => {
    try {
      await saveFlowTemplate(nodes);
    } catch (err) {
      console.error("Save failed", err);
    }
  }, [nodes]);

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

  const handleNodeClick = useCallback(
    (_: any, node: any) => {
      if (selectedNodeId !== node.id) setSelectedNodeId(node.id);
    },
    [selectedNodeId, setSelectedNodeId]
  );

  return (
    <div className="h-full w-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <FlowHeader
        organizeNodes={() => organizeNodes(setNodes)}
        importFlow={(data) => importFlow(data, setNodes, setEdges, deleteNode)}
        exportFlow={() => exportFlow(nodes, edges)}
        onPreview={() => previewFlow(rfInstance)}
        onSave={() => saveFlowTemplate(nodes)}
      />

      <div className="flex flex-1">
        <FlowSidebar
          node={selectedNode}
          onAddNode={handleAddNode}
          onAddNodeFromTemplate={handleAddFromTemplate}
          onNodeDataChange={updateNodeData}
        />

        <div className="flex-1">
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
        </div>
      </div>
    </div>
  );
}

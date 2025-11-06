"use client";

import React, { useState, useMemo } from "react";
import ReactFlow, { Background, Controls, MiniMap, ReactFlowInstance } from "reactflow";
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

const nodeTypes = { custom: CustomNode };

export default function FlowEditor() {
  const { nodes, setNodes, onNodesChange, selectedNodeId, setSelectedNodeId, deleteNode, updateNodeData } = useFlowNodes();
  const { edges, setEdges, onEdgesChange, onConnect } = useFlowEdges();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedNodeId) || null, [nodes, selectedNodeId]);

  return (
    <div className="h-full w-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <FlowHeader
        organizeNodes={() => organizeNodes(setNodes)}
        importFlow={(data) => importFlow(data, setNodes, setEdges, deleteNode)}
        exportFlow={() => exportFlow(nodes, edges)}
        onPreview={() => previewFlow(rfInstance)} onSave={function (): void {
          throw new Error("Function not implemented.");
        } }      />

      <div className="flex flex-1">
        <FlowSidebar
          node={selectedNode}
          onAddNode={() => addNewNode(rfInstance, setNodes, setSelectedNodeId, deleteNode)}
          onAddNodeFromTemplate={(template) => addNodeFromTemplate(template, rfInstance, setNodes, setSelectedNodeId, deleteNode)}
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
            onNodeClick={(_, n) => setSelectedNodeId(n.id)}
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

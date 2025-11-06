import { Node, ReactFlowInstance, Edge } from "reactflow";

// Add a new node
export const addNewNode = (
  rfInstance: ReactFlowInstance | null,
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  setSelectedNodeId: React.Dispatch<React.SetStateAction<string | null>>,
  deleteNode: (id: string) => void
) => {
  if (!rfInstance) return;

  setNodes((nodes) => {
    const id = (nodes.length + 1).toString();
    const { x, y } = rfInstance.getViewport();

    const newNode: Node = {
      id,
      type: "custom",
      position: { x: -x + Math.random() * 200, y: -y + Math.random() * 200 },
      data: { id, title: `Node ${id}`, label: "New Node", fields: [], onDelete: deleteNode },
    };

    setSelectedNodeId(id);
    return [...nodes, newNode];
  });
};

// Add from template
export const addNodeFromTemplate = (
  template: any,
  rfInstance: ReactFlowInstance | null,
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  setSelectedNodeId: React.Dispatch<React.SetStateAction<string | null>>,
  deleteNode: (id: string) => void
) => {
  if (!rfInstance) return;

  setNodes((nodes) => {
    const id = (nodes.length + 1).toString();
    const { x, y } = rfInstance.getViewport();

    const allFields = template.sections.flatMap((section: any) =>
      section.fields.map((field: any) => ({ ...field, section: section.title }))
    );

    const newNode: Node = {
      id,
      type: "custom",
      position: { x: -x + Math.random() * 200, y: -y + Math.random() * 200 },
      data: { id, title: template.title, description: template.description, fields: allFields, onDelete: deleteNode },
    };

    setSelectedNodeId(id);
    return [...nodes, newNode];
  });
};

// Organize in one horizontal line respecting user order
export const organizeNodes = (setNodes: React.Dispatch<React.SetStateAction<Node[]>>, spacing = 350, y = 150) => {
  setNodes((nodes) => {
    const sorted = [...nodes].sort((a, b) => a.position.x - b.position.x);
    return sorted.map((node, i) => ({ ...node, position: { x: i * spacing, y } }));
  });
};

// Import flow
export const importFlow = (
  data: { nodes: Node[]; edges: Edge[] },
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  deleteNode: (id: string) => void
) => {
  if (!data.nodes || !data.edges) return;
  const restored = data.nodes.map((n) => ({ ...n, data: { ...n.data, onDelete: deleteNode } }));
  setNodes(restored);
  setEdges(data.edges);
};

// Export flow
export const exportFlow = (nodes: Node[], edges: Edge[]) => {
  const json = JSON.stringify({ nodes, edges }, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "flow-schema.json";
  a.click();
  URL.revokeObjectURL(url);
};

// Preview flow
export const previewFlow = (rfInstance: ReactFlowInstance | null) => {
  if (rfInstance) console.log(rfInstance.toObject());
};

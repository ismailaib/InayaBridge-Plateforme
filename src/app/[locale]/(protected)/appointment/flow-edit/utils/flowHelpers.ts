
import { createFlowTemplate, getTemplatesByDoctor } from "@/api/flow";
import { Node, Edge, ReactFlowInstance } from "reactflow";

// Add a new node
export const addNewNode = (
  rfInstance: ReactFlowInstance | null,
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  setSelectedNodeId: React.Dispatch<React.SetStateAction<string>>,
  deleteNode: (id: string) => void
) => {
  if (!rfInstance) return;

  const id = crypto.randomUUID();
  const { x, y } = rfInstance.getViewport();

  setNodes((nodes) => {
    const num = nodes.length + 1;
    const newNode: Node = {
      id,
      type: "custom",
      position: { x: -x + Math.random() * 200, y: -y + Math.random() * 200 },
      data: { id, title: `Node ${num}`, label: "New Node", fields: [], onDelete: deleteNode },
    };

    return [...nodes, newNode];
  });
  setSelectedNodeId(id);
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

  const id = crypto.randomUUID();
  const { x, y } = rfInstance.getViewport();

  setNodes((nodes) => {
    const allFields = template.sections.flatMap((section: any) =>
      section.fields.map((field: any) => ({ ...field, section: section.title }))
    );

    const newNode: Node = {
      id,
      type: "custom",
      position: { x: -x + Math.random() * 200, y: -y + Math.random() * 200 },
      data: { id, title: template.title, description: template.description, fields: allFields, onDelete: deleteNode },
    };

    return [...nodes, newNode];
  });
  setSelectedNodeId(id);
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

export const fetchUserFlows = async () => {
  try {
    const stored = localStorage.getItem("user");
    const parsed = stored ? JSON.parse(stored) : null;
    const doctorId = parsed?.doctorProfile?.id;
    if (!doctorId) return [];

    const response = await getTemplatesByDoctor(doctorId);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user flows:", error);
    return [];
  }
};

export async function createDefaultFlow() {
  const stored = localStorage.getItem("user");
  const parsed = stored ? JSON.parse(stored) : null;
  const doctorId = parsed?.doctorProfile?.id;
  if (!doctorId) return;

  const payload = {
    doctorProfileId: doctorId,
    name: "New Flow Template",
    schema: JSON.stringify({
      description: "Automatically generated flow",
      sections: [{ title: "Start Node", fields: [] }],
    }),
    active: true,
  };

  try {
    const res = await createFlowTemplate(payload);
    console.log("Default template created:", res.data);
  } catch (err) {
    console.error("Failed to create default template", err);
  }
};

export function loadFlowToNodesEdges(flow: any, deleteNode: (id: string) => void): { nodes: Node[]; edges: Edge[] } {
  const schema = JSON.parse(flow.schema);
  const nodes: Node[] = schema.sections.map((section: any, index: number) => {
    const id = index === 0 ? '1' : crypto.randomUUID();
    return {
      id,
      type: "custom",
      position: { x: 0, y: 0 },
      data: {
        id,
        title: section.title,
        description: schema.description,
        fields: section.fields,
        onDelete: deleteNode,
        isStartNode: index === 0,
      },
    };
  });

  const edges: Edge[] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      id: `e${nodes[i].id}-${nodes[i + 1].id}`,
      source: nodes[i].id,
      target: nodes[i + 1].id,
    });
  }

  return { nodes, edges };
};

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
// Organize all nodes in one horizontal line based on dependencies.
// Uses topological sort (Kahn) for nodes that appear in edges (linked).
// Nodes that never appear in any edge are appended at the end (preserving original order).
export const organizeNodes = (
  nodes: Node[],
  edges: Edge[],
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  spacing = 350,
  y = 150
) => {
  if (nodes.length === 0) return;

  // Quick path: no edges -> simple left-to-right by original order
  if (!edges || edges.length === 0) {
    setNodes(current =>
      current.map((node, i) => ({
        ...node,
        position: { x: i * spacing, y },
      }))
    );
    return;
  }

  // Build adjacency and indegree for nodes that appear in edges
  const adj = new Map<string, Set<string>>();    // source -> Set(target)
  const indegree = new Map<string, number>();    // nodeId -> indegree
  const linkedSet = new Set<string>();           // nodes that appear in any edge

  // initialize maps for all nodes
  nodes.forEach(n => {
    adj.set(n.id, new Set());
    indegree.set(n.id, 0);
  });

  // fill adjacency / indegree and linkedSet using edges
  edges.forEach(e => {
    // ensure entries exist (defensive)
    if (!adj.has(e.source)) adj.set(e.source, new Set());
    if (!indegree.has(e.target)) indegree.set(e.target, 0);

    // add edge
    adj.get(e.source)!.add(e.target);
    indegree.set(e.target, (indegree.get(e.target) || 0) + 1);

    // mark source/target as linked
    linkedSet.add(e.source);
    linkedSet.add(e.target);
  });

  // Kahn's algorithm for topological ordering limited to linked nodes
  const queue: string[] = [];
  // push linked nodes with indegree 0
  linkedSet.forEach(id => {
    if ((indegree.get(id) || 0) === 0) queue.push(id);
  });

  const topo: string[] = [];
  while (queue.length > 0) {
    const id = queue.shift()!;
    topo.push(id);

    const children = adj.get(id);
    if (!children) continue;
    children.forEach(childId => {
      // only process child if it's part of linkedSet
      if (!linkedSet.has(childId)) return;
      indegree.set(childId, (indegree.get(childId) || 0) - 1);
      if ((indegree.get(childId) || 0) === 0) queue.push(childId);
    });
  }

  // If there are linked nodes not included in topo (cycle or disconnected within linked),
  // include them preserving original nodes order (but after topo).
  const linkedNotInTopo = nodes
    .map(n => n.id)
    .filter(id => linkedSet.has(id) && !topo.includes(id));

  // Build final order:
  // 1. topo (topological for linked nodes)
  // 2. remaining linked nodes not in topo (preserve original order)
  // 3. unlinked nodes (nodes that never appear in any edge), preserve original order
  const unlinkedNodes = nodes.filter(n => !linkedSet.has(n.id)).map(n => n.id);
  const finalOrder = [...topo, ...linkedNotInTopo, ...unlinkedNodes];

  // Apply horizontal positions according to finalOrder
  setNodes(current =>
    current.map(node => {
      const index = finalOrder.indexOf(node.id);
      if (index === -1) return node; // shouldn't happen but safe fallback
      return {
        ...node,
        position: { x: index * spacing, y },
      };
    })
  );
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
    const id = section.id || (index === 0 ? '1' : crypto.randomUUID());
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
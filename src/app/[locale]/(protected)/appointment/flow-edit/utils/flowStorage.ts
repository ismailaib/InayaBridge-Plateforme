import { createFlowTemplate } from "@/api/flow";
import { Node, Edge } from "reactflow";
import { showToast } from "../../../dashboard/hooks/utils";

export const saveFlowTemplate = async (
  nodes: Node[], 
  edges: Edge[], 
  flowId?: string, 
  name: string = "New Flow Template"
) => {
  // Get doctor ID from local storage
  const stored = localStorage.getItem("user");
  const parsed = stored ? JSON.parse(stored) : null;
  const doctorId = parsed?.doctorProfile?.id;
  if (!doctorId) return;

  // Validate inputs
  const validNodes = Array.isArray(nodes) ? nodes : [];
  const validEdges = Array.isArray(edges) ? edges : [];

  if (validNodes.length === 0) {
    alert("No nodes to save!");
    return;
  }

  // Step 1: Sort nodes by visual position (left to right, top to bottom)
  const sortedByPosition = [...validNodes].sort((a, b) => {
    if (Math.abs(a.position.x - b.position.x) > 50) {
      return a.position.x - b.position.x;
    }
    return a.position.y - b.position.y;
  });

  let orderedNodes: Node[] = sortedByPosition;

  // Step 2: If edges exist, check if position order respects dependencies
  if (validEdges.length > 0) {
    // Build dependency graph
    const graph = new Map<string, Set<string>>();
    const parents = new Map<string, Set<string>>();

    validNodes.forEach(node => {
      graph.set(node.id, new Set());
      parents.set(node.id, new Set());
    });

    validEdges.forEach(edge => {
      graph.get(edge.source)?.add(edge.target);
      parents.get(edge.target)?.add(edge.source);
    });

    // Check if position order violates any dependencies
    const nodeIndexMap = new Map(sortedByPosition.map((n, i) => [n.id, i]));
    let needsReorder = false;

    for (const edge of validEdges) {
      const sourceIdx = nodeIndexMap.get(edge.source);
      const targetIdx = nodeIndexMap.get(edge.target);
      
      // If source comes after target, we need to reorder
      if (sourceIdx !== undefined && targetIdx !== undefined && sourceIdx >= targetIdx) {
        needsReorder = true;
        break;
      }
    }

    // Step 3: If needed, do topological sort while preserving visual position hints
    if (needsReorder) {
      const inDegree = new Map<string, number>();
      nodes.forEach(node => inDegree.set(node.id, parents.get(node.id)?.size || 0));

      // Get nodes with no dependencies, sorted by position
      const getNextNodes = () => {
        const available = Array.from(inDegree.entries())
          .filter(([_, degree]) => degree === 0)
          .map(([id, _]) => nodes.find(n => n.id === id)!)
          .sort((a, b) => {
            if (Math.abs(a.position.x - b.position.x) > 50) {
              return a.position.x - b.position.x;
            }
            return a.position.y - b.position.y;
          });
        return available;
      };

      const topoOrder: Node[] = [];
      
      // Build topologically sorted order
      while (true) {
        const available = getNextNodes();
        if (available.length === 0) break;
        
        const node = available[0];
        topoOrder.push(node);
        inDegree.delete(node.id);
        
        // Update dependencies
        graph.get(node.id)?.forEach(childId => {
          inDegree.set(childId, (inDegree.get(childId) || 0) - 1);
        });
      }

      // Check for circular dependencies
      if (topoOrder.length !== nodes.length) {
        console.error("Graph has cycles! Using position order anyway.");
        alert("Warning: Your flow has circular dependencies. Order may be incorrect.");
      } else {
        orderedNodes = topoOrder;
      }
    }
  }

  // Step 4: Build API payload
  const payload: any = {
    doctorProfileId: doctorId,
    name,
    schema: JSON.stringify({
      description: "Automatically generated flow",
      sections: orderedNodes.map((node, index) => ({
        id: node.id,
        title: node.data.title,
        fields: node.data.fields || [],
        order: index,
      })),
    }),
    active: true,
  };

  // If flowId exists, update existing flow (creates v2, v3, etc.)
  // If no flowId, create new flow
  if (flowId) {
    payload.id = flowId;
  } else {
    showToast('success', 'Succès', "Création d'un nouveau schéma...");
  }

  // Step 5: Save to API
  try {
    const res = await createFlowTemplate(payload);
    showToast('success', 'Succès', "Votre schéma a été sauvegardé avec succès !");
    return res.data;
  } catch (err) {
    console.error("Failed to save template", err);
    showToast('success', 'Succès', "Erreur lors de la sauvegarde du schéma.");
  }
};
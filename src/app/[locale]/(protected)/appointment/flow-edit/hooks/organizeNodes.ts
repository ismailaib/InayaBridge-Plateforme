import { Node } from "reactflow";

export const organizeNodes = (
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  spacing = 350,
  y = 150
) => {
  setNodes((nodes) => {
    // Sort nodes by their creation order (or any order you prefer)
    const sorted = [...nodes].sort((a, b) => a.id.localeCompare(b.id));

    // Reposition nodes evenly in one horizontal line
    return sorted.map((node, i) => ({
      ...node,
      position: { x: i * spacing, y },
    }));
  });
};

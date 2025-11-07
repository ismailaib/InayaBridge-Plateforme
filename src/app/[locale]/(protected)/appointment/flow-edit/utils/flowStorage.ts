import { createFlowTemplate } from "@/api/flow";
import { Node } from "reactflow";

export const saveFlowTemplate = async (nodes: Node[]) => {
  const stored = localStorage.getItem("user");
  const parsed = stored ? JSON.parse(stored) : null;
  const doctorId = parsed?.doctorProfile?.id;
  if (!doctorId) return;

  const payload = {
    doctorProfileId: doctorId,
    name: "New Flow Template",
    schema: JSON.stringify({
      description: "Automatically generated flow",
      sections: nodes.map((node) => ({ title: node.data.title, fields: node.data.fields || [] })),
    }),
    active: true,
  };

  try {
    const res = await createFlowTemplate(payload);
    console.log("Template saved:", res.data);
    alert("Flow template saved successfully!");
  } catch (err) {
    console.error("Failed to save template", err);
    alert("Failed to save template");
  }
};
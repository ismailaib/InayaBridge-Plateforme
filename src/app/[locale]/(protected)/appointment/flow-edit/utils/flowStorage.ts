import { createFlowTemplate } from "@/api/flow";

import { Node } from "reactflow";

export const saveFlowTemplate = async (nodes: Node[], flowId?: string, name: string = "New Flow Template") => {
  const stored = localStorage.getItem("user");
  const parsed = stored ? JSON.parse(stored) : null;
  const doctorId = parsed?.doctorProfile?.id;
  if (!doctorId) return;

  const payload: any = {
    doctorProfileId: doctorId,
    name,
    schema: JSON.stringify({
      description: "Automatically generated flow",
      sections: nodes.map((node) => ({
        title: node.data.title,
        fields: node.data.fields || [],
      })),
    }),
    active: true,
  };

  if (flowId) {
    payload.id = flowId;
  }

  try {
    const res = await createFlowTemplate(payload);
    console.log("Template saved:", res.data);
    alert("Flow template saved successfully!");
    return res.data;
  } catch (err) {
    console.error("Failed to save template", err);
    alert("Failed to save template");
  }
};
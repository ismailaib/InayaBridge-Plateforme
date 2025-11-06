'use client'

import { useState } from "react"
import { Button } from "@/components/Button"
import { CopySlash, SquareMousePointer, Layers } from "lucide-react"
import { Node } from "reactflow"
import NodeDetails from "./components/NodeDetails"
import TemplateModal from "./components/TemplateModal"
import { appointmentFlowSchema } from "../../flow/schema/appointmentFlowSchema"

export default function FlowSidebar({
  node,
  onAddNode,
  onAddNodeFromTemplate,
  onNodeDataChange,
}: {
  node: Node | null
  onAddNode: () => void
  onAddNodeFromTemplate: (template: any) => void
  onNodeDataChange: (nodeId: string, data: any) => void
}) {
  const [showAddFieldForm, setShowAddFieldForm] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)

  const handleSelectTemplate = (template: any) => {
    onAddNodeFromTemplate(template)
    setShowTemplateModal(false)
  }

  return (
    <>
      <aside className="h-[calc(100vh-7.85rem)] w-96 border-r dark:border-gray-800 bg-white dark:bg-gray-950 overflow-y-auto overflow-x-hidden p-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={onAddNode}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <SquareMousePointer width={18} /> Ajouter un nœud
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowTemplateModal(true)}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Layers width={18} /> Template
            </Button>
          </div>

          {node ? (
            node.data.isStartNode ? (
              <div className="flex flex-col items-center mt-8 gap-4">
                <CopySlash width={24} className="text-gray-600" />
                <p className="text-sm text-gray-500 text-center">
                  This is the start node and cannot be edited.
                </p>
              </div>
            ) : (
              <>
                <NodeDetails
                  node={node}
                  showAddFieldForm={showAddFieldForm}
                  setShowAddFieldForm={setShowAddFieldForm}
                  onNodeDataChange={onNodeDataChange}
                />

                {!showAddFieldForm && (
                  <Button
                    onClick={() => setShowAddFieldForm(true)}
                    variant="secondary"
                    className="w-full"
                  >
                    Ajouter un champ
                  </Button>
                )}
              </>
            )
          ) : (
            <div className="text-sm text-gray-500 text-center mt-8">
              Aucun nœud sélectionné
            </div>
          )}
        </div>
      </aside>

      <TemplateModal
        open={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        templates={appointmentFlowSchema}
        onSelectTemplate={handleSelectTemplate}
      />
    </>
  )
}
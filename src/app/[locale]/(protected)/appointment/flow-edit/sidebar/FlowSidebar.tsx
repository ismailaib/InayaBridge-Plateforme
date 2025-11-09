'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/Button"
import { CopySlash, SquareMousePointer, Layers, DiamondPlus } from "lucide-react"
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
      <motion.aside
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          delay: 0.9,
          duration: 0.6,
          ease: "easeOut",
        }}
        className="h-[calc(100vh-7.85rem)] w-96 border-r dark:border-gray-800 bg-white dark:bg-gray-950 overflow-y-auto overflow-x-hidden p-4"
      >
        <motion.div
          className="flex flex-col gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                delayChildren: 1.1,
                staggerChildren: 0.12,
              },
            },
          }}
        >
          <motion.div
            className="flex gap-2"
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 },
            }}
          >
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
          </motion.div>

          {node ? (
            node.data.isStartNode ? (
              <motion.div
                className="flex flex-col items-center mt-8 gap-4"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <CopySlash width={24} className="text-gray-600" />
                <p className="text-sm text-gray-500 text-center">
                  This is the start node and cannot be edited.
                </p>
              </motion.div>
            ) : (
              <>
                <NodeDetails
                  node={node}
                  showAddFieldForm={showAddFieldForm}
                  setShowAddFieldForm={setShowAddFieldForm}
                  onNodeDataChange={onNodeDataChange}
                />

                {!showAddFieldForm && (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <Button
                      onClick={() => setShowAddFieldForm(true)}
                      variant="primary"
                      className="w-full flex flex-row items-center justify-center gap-2"
                    >
                      <DiamondPlus width={18} />
                      Ajouter un champ
                    </Button>
                  </motion.div>
                )}
              </>
            )
          ) : (
            <motion.div
              className="text-sm text-gray-500 text-center mt-8"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
              }}
            >
              Aucun nœud sélectionné
            </motion.div>
          )}
        </motion.div>
      </motion.aside>

      <TemplateModal
        open={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        templates={appointmentFlowSchema}
        onSelectTemplate={handleSelectTemplate}
      />
    </>
  )
}

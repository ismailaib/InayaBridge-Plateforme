import { Badge } from "@/components/Badge"
import { Eye, EyeOff, Save, Workflow } from "lucide-react"
import { motion } from "framer-motion"

interface ActionsBarProps {
  organizeNodes: () => void
  onShowPreview: () => void
  onHidePreview: () => void
  onSave: () => void
  isPreviewVisible: boolean
  handleTogglePreview: () => void
  unsaved: boolean
  groupedFlows: { [groupId: string]: any[] }
  selectedFlow: any
}

export default function ActionsBar({
  organizeNodes,
  onSave,
  isPreviewVisible,
  handleTogglePreview,
  unsaved,
  groupedFlows,
  selectedFlow
}: ActionsBarProps) {
  let versionMismatch = false

  if (selectedFlow) {
    const group = groupedFlows[selectedFlow.groupId] || []

    if (group.length > 0) {
      const latestFlow = group.reduce((prev, curr) => {
        return (Number(curr.version) > Number(prev.version) ? curr : prev)
      }, group[0])

      versionMismatch = Number(selectedFlow.version) !== Number(latestFlow.version)
    } else {
      versionMismatch = true
    }
  } else {
    versionMismatch = true
  }

  const items = [
    {
      icon: <Workflow width={18} />,
      label: "Nettoyer le schéma",
      onClick: organizeNodes,
      variant: "neutral",
      disabled: false
    },
    {
      icon: isPreviewVisible ? <EyeOff width={18} /> : <Eye width={18} />,
      label: isPreviewVisible ? "Cacher l'aperçu" : "Afficher l'aperçu",
      onClick: handleTogglePreview,
      variant: "neutral",
      disabled: false
    },
    {
      icon: <Save width={18} />,
      label: "Enregistrer",
      onClick: onSave,
      variant: "default",
      disabled: versionMismatch || !unsaved
    },
  ]

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 overflow-hidden">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.9 + index * 0.10,
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            <Badge
              variant={item.variant as any}
              className={`flex items-center gap-2 cursor-pointer ${item.disabled ? "opacity-50 pointer-events-none" : ""}`}
              onClick={item.onClick}
            >
              {item.icon}
              {item.label}
            </Badge>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
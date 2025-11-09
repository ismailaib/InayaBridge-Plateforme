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
}

export default function ActionsBar({
  organizeNodes,
  onSave,
  isPreviewVisible,
  handleTogglePreview,
}: ActionsBarProps) {
  const items = [
    {
      icon: <Workflow width={18} />,
      label: "Nettoyer le schéma",
      onClick: organizeNodes,
      variant: "neutral",
    },
    {
      icon: isPreviewVisible ? <EyeOff width={18} /> : <Eye width={18} />,
      label: isPreviewVisible ? "Cacher l'aperçu" : "Afficher l'aperçu",
      onClick: handleTogglePreview,
      variant: "neutral",
    },
    {
      icon: <Save width={18} />,
      label: "Enregistrer",
      onClick: onSave,
      variant: "default",
    },
  ]

  return (
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
            className="flex items-center gap-2 cursor-pointer"
            onClick={item.onClick}
          >
            {item.icon}
            {item.label}
          </Badge>
        </motion.div>
      ))}
    </div>
  )
}

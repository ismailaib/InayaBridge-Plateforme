import { Badge } from "@/components/Badge";
import { Eye, EyeOff, Save, Workflow } from "lucide-react";

interface ActionsBarProps {
  organizeNodes: () => void;
  onShowPreview: () => void;
  onHidePreview: () => void;
  onSave: () => void;
  isPreviewVisible: boolean; 
  handleTogglePreview: () => void;
}

export default function ActionsBar({ organizeNodes, onSave, isPreviewVisible, handleTogglePreview }: ActionsBarProps) {
  return (
    <div className="flex gap-2">
      <Badge variant="neutral" className="flex items-center gap-2 cursor-pointer" onClick={organizeNodes}>
        <Workflow width={18} />
        Nettoyer le schéma
      </Badge>

      <Badge variant="neutral" className="flex items-center gap-2 cursor-pointer" onClick={handleTogglePreview}>
        {isPreviewVisible ? <EyeOff width={18} /> : <Eye width={18} />}
        {isPreviewVisible ? "Cacher l'aperçu" : "Afficher l'aperçu"}
      </Badge>

      <Badge variant="default" className="flex items-center gap-2 cursor-pointer" onClick={onSave}>
        <Save width={18} />
        Enregistrer
      </Badge>
    </div>
  );
}
import { Badge } from "@/components/Badge";
import { Eye, Save, Workflow } from "lucide-react";

interface ActionsBarProps {
  organizeNodes: () => void;
  exportFlow: () => void;
  onPreview: () => void;
  onSave: () => void;
}

export default function ActionsBar({ organizeNodes, onPreview, onSave }: ActionsBarProps) {
  return (
    <div className="flex gap-2">
      <Badge variant="neutral" className="flex items-center gap-2 cursor-pointer" onClick={organizeNodes}>
        <Workflow width={18} />
        Nettoyer le schéma
      </Badge>

      <Badge variant="neutral" className="flex items-center gap-2 cursor-pointer" onClick={onPreview}>
        <Eye width={18} />
        Aperçu
      </Badge>

      <Badge variant="default" className="flex items-center gap-2 cursor-pointer" onClick={onSave}>
        <Save width={18} />
        Enregistrer
      </Badge>
    </div>
  );
}

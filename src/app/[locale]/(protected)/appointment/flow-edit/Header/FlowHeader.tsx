import ActionsBar from "./components/ActionsBar";
import MenuHeader from "./components/MenuHeader";

interface FlowHeaderProps {
  organizeNodes: () => void;
  importFlow: (data: any) => void;
  exportFlow: () => void;
  onPreview: () => void;
  onSave: () => void;
}

export default function FlowHeader({ organizeNodes, exportFlow, onPreview, onSave }: FlowHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b dark:border-gray-800 bg-white dark:bg-gray-950">
      <MenuHeader />
      <ActionsBar
        organizeNodes={organizeNodes}
        exportFlow={exportFlow}
        onPreview={onPreview}
        onSave={onSave}
      />
    </header>
  );
}
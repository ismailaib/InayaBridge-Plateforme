import ActionsBar from "./components/ActionsBar";
import MenuHeader from "./components/MenuHeader";

interface FlowHeaderProps {
  flows: any[];
  groupedFlows: { [groupId: string]: any[] };
  nodes: any[];
  selectedFlow: any;
  onSelectFlow: (flow: any) => void;
  onFlowUpdate: (flow: any) => void;
  onShowPreview: () => void;
  onHidePreview: () => void;
  onSave: () => void;
  isPreviewVisible: boolean;
  organizeNodes: () => void;
  onPrevGroup: () => void;
  onNextGroup: () => void;
  onCreateNew: () => void;
  onImport: (data: any) => void;
  onExport: () => void;
  handleDeleteFlow: (flow: any) => void;
}

export default function FlowHeader({ handleDeleteFlow, groupedFlows, selectedFlow, onSelectFlow, onFlowUpdate, organizeNodes, isPreviewVisible, onShowPreview, onHidePreview, onSave, onCreateNew, onImport, onExport }: FlowHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b dark:border-gray-800 bg-white dark:bg-gray-950">
      <MenuHeader
        groupedFlows={groupedFlows}
        selectedFlow={selectedFlow}
        onSelectFlow={onSelectFlow}
        onFlowUpdate={onFlowUpdate}
        onCreateNew={onCreateNew}
        onImport={onImport}
        onExport={onExport}
        handleDeleteFlow={handleDeleteFlow}
      />
      <ActionsBar
        organizeNodes={organizeNodes}
        isPreviewVisible={isPreviewVisible}
        onShowPreview={onShowPreview}
        onHidePreview={onHidePreview}
        onSave={onSave}
        handleTogglePreview={() => isPreviewVisible ? onHidePreview() : onShowPreview()}
      />
    </header>
  );
}
import { Button } from "@/components/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/DropdownMenu";
import { ChevronDown, FileClock, FileDown, FilePlus, Files, FileUp, TvMinimalPlay } from "lucide-react";
import { useRef, useState } from "react";
import { FlowTemplateDto, SchemasModal } from "./SchemasModal";
import { HistoryDrawer } from "./HistoryDrawer";
import { Badge } from "@/components/Badge";
import { FlowNameField } from "./FlowNameField";
import { showToast } from "@/app/[locale]/(protected)/dashboard/hooks/utils";

interface MenuHeaderProps {
  groupedFlows: { [groupId: string]: FlowTemplateDto[] };
  selectedFlow: FlowTemplateDto | null;
  onSelectFlow: (flow: FlowTemplateDto) => void;
  onFlowUpdate: (flow: FlowTemplateDto) => void;
  onCreateNew: () => void;
  onImport: (data: any) => void;
  onExport: () => void;
  handleDeleteFlow: (flow: FlowTemplateDto) => void;
}

export default function MenuHeader({
  groupedFlows,
  selectedFlow,
  onSelectFlow,
  onFlowUpdate,
  onCreateNew,
  onImport,
  onExport,
  handleDeleteFlow,
}: MenuHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const parentFlowsCount = Object.keys(groupedFlows).length;
  const canCreate = parentFlowsCount < 10;

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          onImport(data);
        } catch (err) {
          console.error("Failed to parse import file", err);
        }
      };
      reader.readAsText(file);
      showToast('success', 'Succès', "Fichier importé avec succès.");
    }
  };

  return (
    <div className="flex flex-row items-center gap-1">
      <h1 className="text-lg font-semibold flex items-center gap-1">
        <FlowNameField selectedFlow={selectedFlow} onUpdateFlow={onFlowUpdate}/>
        <Badge variant="neutral">v{selectedFlow?.version || 0}</Badge>
      </h1>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0 px-1">
            <ChevronDown width={18} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>Concepteur de flux</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            {/* <Tooltip className="w-[100%]" content={canCreate ? "" : "Maximum 10 parent flows reached"}> */}
              <div className="w-full">
                <DropdownMenuItem
                  onClick={canCreate ? onCreateNew : undefined}
                  disabled={!canCreate}
                  className="flex flex-row w-full items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  <FilePlus width={18} />
                  Créer un nouveau
                </DropdownMenuItem>
              </div>
            {/* </Tooltip> */}

            <DropdownMenuItem
              onSelect={(e: { preventDefault: () => void }) => {
                e.preventDefault();
                setModalOpen(true);
              }}
              className="flex flex-row items-center gap-2"
            >
              <Files width={18} />
              Mes schémas
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={(e: { preventDefault: () => void }) => {
                e.preventDefault();
                setDrawerOpen(true);
              }}
              className="flex flex-row items-center gap-2"
            >
              <FileClock width={18} />
              Historique
            </DropdownMenuItem>

            <DropdownMenuItem onClick={onExport} className="flex flex-row items-center gap-2">
              <FileDown width={18} />
              Exporter
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="flex flex-row items-center gap-2">
              <FileUp width={18}/>
              Importer
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex flex-row items-center gap-2">
            <TvMinimalPlay width={18}/>
            Tutoriels
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SchemasModal
        open={isModalOpen}
        onOpenChange={setModalOpen}
        groupedFlows={groupedFlows}
        onSelectFlow={onSelectFlow}
        handleDeleteFlow={handleDeleteFlow}
      />

      <HistoryDrawer
        open={isDrawerOpen}
        onOpenChange={setDrawerOpen}
        groupedFlows={groupedFlows}
        selectedFlow={selectedFlow}
        onSelectFlow={onSelectFlow}
      />

      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept=".json"
        onChange={handleImportFile}
      />
    </div>
  );
}

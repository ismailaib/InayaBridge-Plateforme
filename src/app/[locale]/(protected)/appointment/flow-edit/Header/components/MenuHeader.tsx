import { Button } from "@/components/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/DropdownMenu";
import { ChevronDown, FileClock, FileDown, FilePlus, Files, FileUp, TvMinimalPlay } from "lucide-react";
import { useRef, useState } from "react";
import { FlowTemplateDto, SchemasModal } from "./SchemasModal";
import { HistoryDrawer } from "./HistoryDrawer";
import { Badge } from "@/components/Badge";


interface MenuHeaderProps {
  groupedFlows: { [groupId: string]: FlowTemplateDto[] };
  selectedFlow: FlowTemplateDto | null;
  onSelectFlow: (flow: FlowTemplateDto) => void;
  onCreateNew: () => void;
  onImport: (data: any) => void;
  onExport: () => void;
  handleDeleteFlow: (flow: FlowTemplateDto) => void;
}

export default function MenuHeader({
  groupedFlows,
  selectedFlow,
  onSelectFlow,
  onCreateNew,
  onImport,
  onExport,
  handleDeleteFlow,
}: MenuHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

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
    }
  };

  return (
    <div className="flex flex-row items-center gap-1">
      <h1 className="text-lg font-semibold flex items-center gap-1">
        {selectedFlow?.name || "Schéma de flux"}
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
            <DropdownMenuItem onClick={onCreateNew} className="flex flex-row items-center gap-2">
              <FilePlus width={18} />
              Créer un nouveau
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e: { preventDefault: () => void; }) => {
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
              onSelect={(e: { preventDefault: () => void; }) => {
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
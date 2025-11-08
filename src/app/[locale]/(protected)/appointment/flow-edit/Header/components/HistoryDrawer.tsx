import { Button } from "@/components/Button";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerBody } from "@/components/Drawer";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge"; // optional Tremor-style badge component
import { format } from "date-fns";
import { Divider } from "@/components/Divider";
import { Fullscreen, UndoDot } from "lucide-react";
import { FlowTemplateDto } from "./SchemasModal";

interface HistoryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupedFlows: { [groupId: string]: FlowTemplateDto[] };
  selectedFlow: FlowTemplateDto | null;
  onSelectFlow: (flow: FlowTemplateDto) => void;
  onViewFlow?: (flow: FlowTemplateDto) => void;
  onRestoreFlow?: (flow: FlowTemplateDto) => void;
}

export function HistoryDrawer({
  open,
  onOpenChange,
  groupedFlows,
  selectedFlow,
  onSelectFlow,
}: HistoryDrawerProps) {
  const versions =
    selectedFlow && groupedFlows[selectedFlow.groupId]
      ? [...groupedFlows[selectedFlow.groupId]].sort((a, b) => b.version - a.version)
      : [];

  const handleSelectFlow = (flow: FlowTemplateDto) => {
    onSelectFlow(flow);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="sm:max-w-lg">
        <DrawerHeader>
          <DrawerTitle>Historique du schéma</DrawerTitle>
        </DrawerHeader>

        <DrawerBody className="py-4">
          {versions.length > 0 ? (
            <div className="flex flex-col gap-3">
              {versions.map(flow => (
                <div key={flow.id} className="flex flex-col items-center justify-center">
                  <div  className="w-full flex justify-between items-center">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Version {flow.version}</span>
                      </div>
                      <div className="text-sm text-muted-foreground text-gray-400">
                        Créé le:{" "}
                        {format(new Date(flow.createdAt), "dd/MM/yyyy HH:mm")}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => handleSelectFlow?.(flow)}
                        className="flex flex-row items-center gap-2"
                      >
                        <Fullscreen width={18}/>
                        Voir
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleSelectFlow?.(flow)}
                        className="flex flex-row items-center gap-2"
                      >
                        <UndoDot width={18}/>
                        Restaurer
                      </Button>
                    </div>

                  </div>
                  <Divider />
                </div>

              ))}
            </div>

          ) : (
            <p className="text-sm text-muted-foreground">
              Aucun historique disponible pour ce schéma.
            </p>
          )}
        </DrawerBody>

        <DrawerFooter className="mt-6">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

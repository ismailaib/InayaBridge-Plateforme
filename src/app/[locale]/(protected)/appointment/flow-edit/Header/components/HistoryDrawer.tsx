import { useState, useMemo } from "react";
import { Button } from "@/components/Button";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerBody } from "@/components/Drawer";
import { format } from "date-fns";
import { Divider } from "@/components/Divider";
import { ArrowRightLeft, Fullscreen, GitPullRequestCreateArrow, PencilRuler, Replace, ScanEye, Trash2, XCircle } from "lucide-react";
import { FlowTemplateDto } from "./SchemasModal";
import { deleteFlowTemplate, restoreFlowTemplate } from "@/api/flow";
import { showToast } from "@/app/[locale]/(protected)/dashboard/hooks/utils";

interface HistoryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupedFlows: { [groupId: string]: FlowTemplateDto[] };
  selectedFlow: FlowTemplateDto | null;
  onSelectFlow: (flow: FlowTemplateDto) => void;
  onFlowDeleted?: (id: string) => void;
}

export function HistoryDrawer({
  open,
  onOpenChange,
  groupedFlows,
  selectedFlow,
  onSelectFlow,
  onFlowDeleted,
}: HistoryDrawerProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deletedIds, setDeletedIds] = useState(new Set<string>());

  const localVersions = useMemo(() => {
    if (!selectedFlow || !groupedFlows[selectedFlow.groupId]) return [];
    return [...groupedFlows[selectedFlow.groupId]].sort((a, b) => b.version - a.version);
  }, [selectedFlow, groupedFlows]);

  const displayedVersions = useMemo(() => {
    return localVersions.filter(v => !deletedIds.has(v.id));
  }, [localVersions, deletedIds]);

  const latestVersionId = displayedVersions[0]?.id;

  const handleSelectFlow = (flow: FlowTemplateDto) => {
    onSelectFlow(flow);
  };
  const handleRestoreFlow = async (flow: FlowTemplateDto) => {
    try {
      const { data: restoredFlow } = await restoreFlowTemplate(flow.id);

      setDeletedIds((prev) => new Set([...prev]));

      onSelectFlow(restoredFlow);

      if (groupedFlows[restoredFlow.groupId]) {
        groupedFlows[restoredFlow.groupId] = [
          restoredFlow,
          ...groupedFlows[restoredFlow.groupId],
        ].sort((a, b) => b.version - a.version);
      }
      onOpenChange(false);
      showToast('success', 'Succès', "Flow restauré avec succès.");

    } catch (err) {
      console.error("Error restoring flow:", err);
      showToast('error', 'Erreur', "Erreur lors de la restauration du flow.");
    }
  };
  const handleDelete = async (flow: FlowTemplateDto) => {
    if (confirmDelete === flow.id) {
      try {
        await deleteFlowTemplate(flow.id);
        setDeletedIds((prev) => new Set([...prev, flow.id]));
        onFlowDeleted?.(flow.id);
        showToast('success', 'Succès', "Flow supprimé avec succès.");
       
        // Auto-select the latest remaining flow if the deleted one was selected
        const updatedVersions = localVersions.filter(v => v.id !== flow.id);
        if (selectedFlow?.id === flow.id) {
          if (updatedVersions.length > 0) {
            onSelectFlow(updatedVersions[0]);
          } else {
            onOpenChange(false);
          }
        }
      } catch (err) {
        console.error("Error deleting flow:", err);
      } finally {
        setConfirmDelete(null);
      }
    } else {
      setConfirmDelete(flow.id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="sm:max-w-lg">
        <DrawerHeader>
          <DrawerTitle>Historique du schéma: {selectedFlow?.name}</DrawerTitle>
          <p className="text-gray-600 text-sm">Description</p>
        </DrawerHeader>

        <DrawerBody className="py-4">
          {displayedVersions.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  {displayedVersions.length} / 15 versions
                </span>
                <span className="text-xs text-gray-500">
                  {15 - displayedVersions.length} restantes
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all ${displayedVersions.length >= 15
                    ? "bg-red-500"
                    : displayedVersions.length >= 12
                      ? "bg-yellow-500"
                      : "bg-green-500"
                    }`}
                  style={{ width: `${(displayedVersions.length / 15) * 100}%` }}
                ></div>
              </div>
              {displayedVersions.length >= 15 && (
                <p className="text-xs text-red-500 mt-2">
                  Les anciennes versions seront automatiquement supprimées après chaque sauvegarde.
                </p>
              )}
            </div>
          )}

          <Divider />

          {displayedVersions.length > 0 ? (
            <div className="flex flex-col gap-3">
              {displayedVersions.map(flow => (
                <div key={flow.id} className="flex flex-col items-center justify-center">
                  <div className="w-full flex justify-between items-center">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Version {flow.version}</span>
                      </div>
                      <div className="text-sm text-muted-foreground text-gray-400">
                        Créé le: {format(new Date(flow.createdAt), "dd/MM/yyyy HH:mm")}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {flow.id === latestVersionId && (
                        <Button
                          variant="secondary"
                          onClick={() => handleSelectFlow(flow)}
                          className="flex flex-row items-center gap-2"
                        >
                          <PencilRuler width={18} />
                        </Button>
                      )}
                      {flow.id !== latestVersionId && (
                        <Button
                          variant="secondary"
                          onClick={() => handleSelectFlow(flow)}
                          className="flex flex-row items-center gap-2"
                        >
                          <ScanEye width={18} />
                        </Button>
                      )}


                      {flow.id !== latestVersionId && (
                        <Button
                          variant="secondary"
                          onClick={() => handleRestoreFlow(flow)}
                          className="flex flex-row items-center gap-2"
                          disabled={displayedVersions.length >= 15}
                        >
                          <GitPullRequestCreateArrow width={18} />
                        </Button>
                      )}


                      {flow.id !== latestVersionId && (
                        <Button
                          variant={confirmDelete === flow.id ? "destructive" : "secondary"}
                          onClick={() => handleDelete(flow)}
                          className="flex flex-row items-center gap-2"
                        >
                          {confirmDelete === flow.id ? <XCircle width={18} /> : <Trash2 width={18} />}
                        </Button>
                      )}
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
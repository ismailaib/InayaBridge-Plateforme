import { useState, useMemo } from "react"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from "@/components/Dialog"
import { Input } from "@/components/Input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/DropdownMenu"
import { RiMore2Fill, RiCloseLine } from "@remixicon/react"
import { Copy, FileClock, FileDown, PencilRuler, Trash2, X } from "lucide-react"
import { format } from "date-fns"
import { Label } from "@/components/Label"

export interface FlowTemplateDto {
  groupId: string
  id: string
  doctorProfileId: string
  name: string
  schema: string
  version: number
  active: boolean
  createdAt: number
}

interface SchemasModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  groupedFlows: { [groupId: string]: FlowTemplateDto[] }
  onSelectFlow: (flow: FlowTemplateDto) => void
  onViewFlow?: (flow: FlowTemplateDto) => void
  onRestoreFlow?: (flow: FlowTemplateDto) => void
  handleDeleteFlow?: (flow: FlowTemplateDto) => void
  onExportFlow?: (flow: FlowTemplateDto) => void
  onDuplicateFlow?: (flow: FlowTemplateDto) => void
  onShowHistory?: (flow: FlowTemplateDto) => void
}

export function SchemasModal({
  open,
  onOpenChange,
  groupedFlows,
  onSelectFlow,
  onViewFlow,
  handleDeleteFlow,
  onExportFlow,
  onDuplicateFlow,
  onShowHistory,
}: SchemasModalProps) {
  const [search, setSearch] = useState("")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedFlow, setSelectedFlow] = useState<FlowTemplateDto | null>(null)
  const [confirmName, setConfirmName] = useState("")

  const uniqueFlows = useMemo(() => {
    return Object.keys(groupedFlows)
      .map(groupId => {
        const sorted = groupedFlows[groupId].sort((a, b) => (b.version || 0) - (a.version || 0))
        return sorted[0]
      })
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  }, [groupedFlows])

  const filteredFlows = uniqueFlows.filter(flow =>
    flow.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelectFlow = (flow: FlowTemplateDto) => {
    onSelectFlow(flow)
    onOpenChange(false)
  }

  const handleConfirmDelete = (flow: FlowTemplateDto) => {
    setSelectedFlow(flow)
    setConfirmName("")
    setConfirmOpen(true)
  }

  const handleDelete = () => {
    if (selectedFlow && confirmName === selectedFlow.name) {
      handleDeleteFlow?.(selectedFlow)
      setConfirmOpen(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={`sm:max-w-6xl ${filteredFlows.length ? "h-[90vh]" : "min-h-[400px]"}`}>
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Mes schémas disponibles</DialogTitle>
            <div className="flex justify-end">
              <Button variant="light" onClick={() => onOpenChange(false)}>
                <X width={18} />
              </Button>
            </div>
          </DialogHeader>

          <div className="mt-4 px-2 sm:px-0">
            <Input placeholder="Rechercher un schéma..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4 overflow-y-auto">
            {filteredFlows.length > 0 ? (
              filteredFlows.map(flow => (
                <Card
                  key={flow.groupId}
                  className="flex flex-col p-0 relative cursor-pointer hover:shadow-lg transition dark:bg-gray-950"
                  onDoubleClick={() => handleSelectFlow(flow)}
                >
                  <div className="w-full h-32 bg-gray-100 rounded-t-md flex items-center justify-center mb-3 text-gray-400 text-sm">
                    Flow Preview
                  </div>

                  <div className="flex flex-col gap-1 mb-3 p-2 relative">
                    <span className="font-semibold text-lg">{flow.name}</span>
                    <span className="text-xs text-gray-400">
                      Créé le: {format(new Date(flow.createdAt), "dd/MM/yyyy HH:mm")}
                    </span>
                    <div className="absolute top-2 right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="p-1">
                            <RiMore2Fill className="text-gray-600 size-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-[180px]">
                          <DropdownMenuItem onClick={() => onViewFlow?.(flow)}>
                            <PencilRuler className="size-4 mr-2" /> Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onShowHistory?.(flow)}>
                            <FileClock className="size-4 mr-2" /> Historique
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onExportFlow?.(flow)}>
                            <FileDown className="size-4 mr-2" /> Exporter
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDuplicateFlow?.(flow)}>
                            <Copy className="size-4 mr-2" /> Dupliquer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleConfirmDelete(flow)} className="text-red-500">
                            <Trash2 className="size-4 mr-2" /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-sm text-muted-foreground col-span-full text-center py-20">
                Aucun schéma disponible.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation modal */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogClose asChild>
            <Button
              className="absolute right-3 top-3 p-2 !text-gray-400 hover:text-gray-500 dark:!text-gray-600 hover:dark:text-gray-500"
              variant="ghost"
            >
              <RiCloseLine className="size-5 shrink-0" />
            </Button>
          </DialogClose>
          <DialogHeader>
            <DialogTitle className="text-base">
              Supprimer le schéma
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pour confirmer la suppression, veuillez entrer le nom exact du schéma :
            <span className="block mt-1 font-medium text-gray-900 dark:text-gray-50">
              {selectedFlow?.name}
            </span>
          </p>

          <div className="mt-4">
            <Label htmlFor="schema-name">Nom du schéma</Label>
            <Input
              id="schema-name"
              placeholder="Saisissez le nom du schéma"
              value={confirmName}
              onChange={e => setConfirmName(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="destructive"
              className="w-full"
              disabled={confirmName !== selectedFlow?.name}
              onClick={handleDelete}
            >
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

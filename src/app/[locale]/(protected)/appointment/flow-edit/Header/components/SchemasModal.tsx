import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Dialog"
import { Divider } from "@/components/Divider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/DropdownMenu"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { RiCloseLine, RiMore2Fill } from "@remixicon/react"
import { format } from "date-fns"
import { CircleOff, PencilRuler, Trash2, X } from "lucide-react"
import { useMemo, useState } from "react"
import FlowPreview from "./FlowPreview"
import { AnimatePresence, motion } from "framer-motion"
import { showToast } from "@/app/[locale]/(protected)/dashboard/hooks/utils"

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
  handleDeleteFlow,
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

  const totalParents = Object.keys(groupedFlows).length
  const parentLimit = 10
  const parentProgress = Math.min((totalParents / parentLimit) * 100, 100)

  const filteredFlows = uniqueFlows.filter(flow =>
    flow.name.toLowerCase().includes(search.toLowerCase())
  )

  const gridClass = filteredFlows.length > 0
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    : "flex items-center justify-center"

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
      showToast('success', 'Succès', "Flow supprimé avec succès.");
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-6xl max-h-[90vh] min-h-[400px] flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between">
            <div>
              <DialogTitle>Mes schémas disponibles</DialogTitle>
              <p className="text-gray-600 text-sm">Description</p>
            </div>

            <Button variant="light" onClick={() => onOpenChange(false)}>
              <X width={18} />
            </Button>
          </DialogHeader>
          <Divider />
          {/* Parent Flow Counter */}
          <div className="my-2">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Nombre total de schémas principaux</span>
              <span className=" text-sm text-gray-500">
                {totalParents}/{parentLimit}
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${parentProgress >= 90 ? "bg-red-500" : parentProgress >= 70 ? "bg-yellow-500" : "bg-green-500"
                  }`}
                style={{ width: `${parentProgress}%` }}
              ></div>
            </div>
          </div>
          <Divider />
          <div className="mt-4 px-2 sm:px-0">
            <Input placeholder="Rechercher un schéma..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className={`${gridClass} flex-1 mt-6 overflow-y-auto pb-6`}>
            <AnimatePresence>
              {filteredFlows.length > 0 ? (
                filteredFlows.slice().reverse().map((flow, index) => {
                  const versions = groupedFlows[flow.groupId]?.length || 1
                  // const progress = (versions / 15) * 100

                  return (
                    <motion.div
                      key={flow.groupId}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className="flex flex-col p-0 relative cursor-pointer hover:shadow-lg transition dark:bg-gray-950 border border-gray-200 dark:border-gray-800"
                        onDoubleClick={() => handleSelectFlow(flow)}
                      >
                        <div className="w-full h-40 bg-gray-100 dark:bg-gray-900 rounded-t-md overflow-hidden flex items-center justify-center text-gray-400 text-sm">
                          <FlowPreview schema={JSON.parse(flow.schema)} />
                        </div>

                        <div className="flex flex-col gap-0 p-4 relative border-t border-gray-800">
                          <div className="flex justify-between items-start">
                            <span className="font-semibold text-lg leading-tight">{flow.name}</span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="p-1">
                                  <RiMore2Fill className="text-gray-600 size-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="min-w-[180px]">
                                <DropdownMenuItem onClick={() => handleSelectFlow(flow)}>
                                  <PencilRuler className="size-4 mr-2" /> Modifier
                                </DropdownMenuItem>
                                {/* TODO . */}
                                {/* <DropdownMenuItem onClick={() => onExportFlow?.(flow)}>
                                  <FileDown className="size-4 mr-2" /> Exporter
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onDuplicateFlow?.(flow)} disabled={totalParents == parentLimit} className={` ${totalParents == parentLimit ? "cursor-not-allowed" : ""}`}>
                                  <Copy className="size-4 mr-2" /> Dupliquer
                                </DropdownMenuItem>*/}
                                <DropdownMenuSeparator /> 
                                <DropdownMenuItem onClick={() => handleConfirmDelete(flow)} className="text-red-500">
                                  <Trash2 className="size-4 mr-2" /> Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <span className="text-xs text-gray-400">
                            Créé le {format(new Date(flow.createdAt), "dd/MM/yyyy HH:mm")}
                          </span>

                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Versions</span>
                              <span>{versions}/15</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })
              ) : (
                <motion.div
                  key="empty"
                  className="flex flex-col items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CircleOff width={18} />
                  <p className="text-sm text-muted-foreground text-center">
                    Aucun schéma disponible.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </DialogContent>
      </Dialog >

      {/* Delete confirmation modal */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen} >
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
            <DialogTitle className="text-base">Supprimer le schéma</DialogTitle>
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
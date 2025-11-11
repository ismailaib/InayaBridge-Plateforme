"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/Input"
import { Divider } from "@/components/Divider"
import { Card } from "@/components/Card"
import { AnimatePresence, motion } from "framer-motion"
import { CircleOff } from "lucide-react"
import FlowPreview from "../../../flow-edit/Header/components/FlowPreview"
import { FlowTemplateDto } from "@/api/flow"

interface FlowSelectorProps {
  flows: FlowTemplateDto[]
  onSelectFlow: (flow: FlowTemplateDto) => void
}

export default function FlowSelector({ flows, onSelectFlow }: FlowSelectorProps) {
  const [search, setSearch] = useState("")

  const latestFlows = useMemo(() => {
    const latestMap = new Map<string, FlowTemplateDto>()
    flows.forEach(flow => {
      const existing = latestMap.get(flow.groupId)
      if (!existing || flow.version > existing.version) {
        latestMap.set(flow.groupId, flow)
      }
    })
    return Array.from(latestMap.values())
  }, [flows])

  const filteredFlows = useMemo(() => {
    return latestFlows.filter(flow =>
      flow.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [latestFlows, search])

  return (
    <div className="mt-2">
      <h2 className="text-lg font-semibold mb-1">Sélectionnez un flow</h2>
      <p className="text-gray-500 text-sm mb-4">
        Choisissez le flow de consultation à utiliser pour ce rendez-vous.
      </p>

      <Divider />

      <div className="mt-3">
        <Input
          placeholder="Rechercher un flow..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-4">
        {filteredFlows.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredFlows.map((flow, index) => (
                <motion.div
                  key={flow.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    onClick={() => onSelectFlow(flow)}
                    className="p-0 cursor-pointer hover:shadow-lg transition border border-gray-200 dark:border-gray-800 overflow-hidden"
                  >
                    <div className="w-full h-36 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                      <FlowPreview schema={JSON.parse(flow.schema)} />
                    </div>
                    <div className="p-4 border-t border-gray-800">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{flow.name}</span>
                        <span className="text-xs text-gray-400">v{flow.version}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Créé le{" "}
                        {new Date(flow.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-2 text-gray-500 h-48 justify-center"
          >
            <CircleOff size={20} />
            <p className="text-sm">Aucun flow trouvé</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

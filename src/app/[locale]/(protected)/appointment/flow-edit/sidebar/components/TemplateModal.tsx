'use client'

import { useState, useMemo } from "react"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/Dialog"
import { Input } from "@/components/Input"
import { Button } from "@/components/Button"
import { RiCloseLine } from "@remixicon/react"
import { Card } from "@/components/Card"

export default function TemplateModal({
    open,
    onClose,
    templates,
    onSelectTemplate,
}: {
    open: boolean
    onClose: () => void
    templates: any[]
    onSelectTemplate: (template: any) => void
}) {
    const [search, setSearch] = useState("")
    const [expandedTemplateId, setExpandedTemplateId] = useState<string | null>(null)

    const filteredTemplates = useMemo(() => {
        return templates.filter((t) =>
            t.title.toLowerCase().includes(search.toLowerCase())
        )
    }, [search, templates])

    const toggleExpand = (id: string) => {
        setExpandedTemplateId(prev => (prev === id ? null : id))
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="p-0 sm:max-w-4xl">
                <DialogClose asChild>
                    <Button
                        variant="ghost"
                        className="absolute right-3 top-3 p-2 !text-gray-400 hover:text-gray-500 dark:!text-gray-600 hover:dark:text-gray-500"
                    >
                        <RiCloseLine className="size-5 shrink-0" />
                    </Button>
                </DialogClose>

                <DialogHeader className="border-b border-gray-200 px-6 py-4 dark:border-gray-900">
                    <DialogTitle className="text-base font-semibold">
                        Sélectionner un modèle de nœud
                    </DialogTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Choisissez un modèle préconfiguré pour accélérer la création de votre flux.
                    </p>
                </DialogHeader>

                <div className="flex flex-col">
                    {/* Sidebar */}
                    <div className="flex flex-col justify-between border-gray-200 dark:border-gray-900">
                        <div className="p-6 flex flex-row items-center">
                            <Input
                                placeholder="Rechercher un modèle..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Template Grid */}
                    <div className="flex-1 p-6 overflow-y-auto max-h-[70vh] min-h-[70vh]">
                        {filteredTemplates.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                                Aucun modèle trouvé
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4">
                                {filteredTemplates.map((t) => (
                                    <Card
                                        key={t.id}
                                        className="flex flex-col justify-between cursor-pointer"
                                    >
                                        <div>
                                            <h3 className="font-medium text-base">{t.title}</h3>
                                            <p className="text-xs text-gray-500 mt-1">{t.description}</p>

                                            {expandedTemplateId === t.id && (
                                                <div className="mt-3 max-h-64 overflow-y-auto border-t border-gray-200 pt-2 dark:border-gray-800">
                                                    {t.sections.map((section: any, idx: number) => (
                                                        <div key={idx} className="mb-4">
                                                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                                {section.title}
                                                            </p>

                                                            <div className="overflow-x-auto">
                                                                <table className="min-w-full text-xs text-left text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                                                                    <thead className="bg-gray-100 dark:bg-gray-900">
                                                                        <tr>
                                                                            <th className="px-3 py-1 border-b border-gray-200 dark:border-gray-700">Label</th>
                                                                            <th className="px-3 py-1 border-b border-gray-200 dark:border-gray-700">Type</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {section.fields.map((field: any) => (
                                                                            <tr key={field.name} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                                                <td className="px-3 py-1 border-b border-gray-200 dark:border-gray-700">
                                                                                    {field.label}
                                                                                </td>
                                                                                <td className="px-3 py-1 border-b border-gray-200 dark:border-gray-700">
                                                                                    {field.type}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>


                                        <div className="flex items-center gap-2 mt-3">
                                            <Button
                                                variant="light"
                                                className="w-full"
                                                onClick={() => toggleExpand(t.id)}
                                            >
                                                {expandedTemplateId === t.id ? 'Masquer les Champs' : 'Voir les Champs'}
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                className="w-full"
                                                onClick={() => {
                                                    onSelectTemplate(t)
                                                    onClose()
                                                }}
                                            >
                                                Utiliser ce modèle
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

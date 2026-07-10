'use client'

import { getAllPermissions } from '@/api/permissions'
import { createRole } from '@/api/roles'
import { Button } from '@/components/Button'
import { Checkbox } from '@/components/Checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/Dialog'
import { Divider } from '@/components/Divider'
import { Input } from '@/components/Input'
import { Label } from '@/components/Label'
import { RiCloseLine } from '@remixicon/react'
import { ChevronDown, ChevronRight, Plus, Save, SendToBack, SmilePlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { showToast } from '../../../dashboard/hooks/utils'

// =========================
// Types
// =========================
type Permission = {
  id: string
  name: string
  description?: string
}

type Module = {
  id: string
  name: string
  permissions: Permission[]
  isExpanded?: boolean
}

interface AddRoleModalProps {
  onRoleAdded?: () => void
  tenant: string
}

export default function AddRoleModal({ onRoleAdded, tenant }: AddRoleModalProps) {
  const [open, setOpen] = useState(false)
  const [modules, setModules] = useState<Module[]>([])
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grouped' | 'list'>('grouped')
  const [loading, setLoading] = useState(false)
  const [roleName, setRoleName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const { data } = await getAllPermissions()
        const grouped: Record<string, Permission[]> = {}

        data.forEach((perm) => {
          const [module] = perm.id.split('.')
          if (!grouped[module]) grouped[module] = []
          grouped[module].push(perm)
        })

        const formattedModules = Object.entries(grouped).map(([key, perms]) => ({
          id: key,
          name: key.charAt(0).toUpperCase() + key.slice(1),
          permissions: perms,
          isExpanded: false,
        }))

        setModules(formattedModules)
      } catch {
        showToast('error', 'Erreur', 'Impossible de charger les permissions.')
      }
    }
    fetchPermissions()
  }, [])

  // ===== Logic =====
  const togglePermission = (permId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId)
        ? prev.filter((p) => p !== permId)
        : [...prev, permId],
    )
  }

  const toggleModule = (moduleId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m,
      ),
    )
  }

  const selectAllInModule = (module: Module) => {
    const ids = module.permissions.map((p) => p.id)
    const allSelected = ids.every((id) => selectedPermissions.includes(id))
    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((id) => !ids.includes(id)))
    } else {
      setSelectedPermissions((prev) => [...new Set([...prev, ...ids])])
    }
  }

  const getModuleSelectionState = (module: Module) => {
    const ids = module.permissions.map((p) => p.id)
    const count = ids.filter((id) => selectedPermissions.includes(id)).length
    if (count === 0) return 'none'
    if (count === ids.length) return 'all'
    return 'partial'
  }

  // ===== Submit =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!roleName.trim()) {
      showToast('error', 'Champ requis', 'Le nom du rôle est obligatoire.')
      return
    }

    try {
      setLoading(true)
      await createRole({
        name: roleName,
        description,
        tenantId: tenant,
        permissions: selectedPermissions,
        status: 'ACTIVE',
      })

      showToast('success', 'Succès', 'Rôle ajouté avec succès.')
      setOpen(false)
      setSelectedPermissions([])
      setRoleName('')
      setDescription('')
      onRoleAdded?.()
    } catch {
      showToast('error', 'Erreur', 'Impossible de créer le rôle.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" className="flex items-center gap-2">
          <Plus className="size-4" />
          Ajouter un Rôle
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 sm:max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogClose asChild>
          <Button
            variant="ghost"
            className="absolute right-3 top-3 z-50 p-2 !text-gray-400 hover:text-gray-500 dark:!text-gray-600 hover:dark:text-gray-500"
          >
            <RiCloseLine className="size-5 shrink-0" />
          </Button>
        </DialogClose>

        <DialogHeader className="border-b border-gray-200 px-6 py-4 dark:border-gray-900">
          <DialogTitle className="text-base font-semibold">Ajouter un Role</DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Créez un role et associé à un employés du cabinet.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="flex flex-col justify-between border-r border-gray-200 dark:border-gray-900 w-72 shrink-0">
            <div className="p-6 overflow-y-auto">
              <div className="flex items-center space-x-3">
                <div className="inline-flex shrink-0 items-center justify-center rounded bg-gray-100 p-3 dark:bg-gray-800">
                  <SmilePlus className="size-5 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    Nouveau Rôle
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">
                    {selectedPermissions.length} permission(s) sélectionnée(s)
                  </p>
                </div>
              </div>
              <Divider className="my-4" />
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="font-medium text-sm">
                    Nom du rôle <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ex : Médecin"
                    className="mt-2"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="font-medium text-sm">
                    Description
                  </Label>
                  <Input
                    id="description"
                    placeholder="Brève description"
                    className="mt-2"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t border-gray-200 p-4 dark:border-gray-900">
              <Button variant="secondary" onClick={() => setOpen(false)} className="flex-1">
                Annuler
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                <Save className="size-4 mr-2" /> {loading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {modules.length === 0 ? (
              <div className="text-center text-gray-500">Chargement des permissions...</div>
            ) : viewMode === 'grouped' ? (
              <div className="space-y-3">
                {modules.map((module) => {
                  const state = getModuleSelectionState(module)
                  return (
                    <div key={module.id} className="border rounded-lg overflow-hidden dark:border-gray-800 bg-white dark:bg-gray-900/50">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-800">
                        <div className="flex items-center gap-3 flex-1">
                          <button type="button" onClick={() => toggleModule(module.id)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                            {module.isExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                          </button>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                              {module.name}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {module.permissions.length} permission(s)
                            </p>
                          </div>
                        </div>
                        <Checkbox
                          checked={state === 'all'}
                          onCheckedChange={() => selectAllInModule(module)}
                          className={state === 'partial' ? 'opacity-50' : ''}
                        />
                      </div>

                      {module.isExpanded && (
                        <div className="p-4 space-y-3">
                          {module.permissions.map((perm) => (
                            <label key={perm.id} className="flex items-start gap-3 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                              <Checkbox
                                checked={selectedPermissions.includes(perm.id)}
                                onCheckedChange={() => togglePermission(perm.id)}
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {perm.name}
                                </div>
                                {perm.description && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {perm.description}
                                  </p>
                                )}
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {modules.flatMap((module) =>
                  module.permissions.map((perm) => (
                    <label key={perm.id} className="flex items-start gap-3 p-3 rounded-md border dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                      <Checkbox
                        checked={selectedPermissions.includes(perm.id)}
                        onCheckedChange={() => togglePermission(perm.id)}
                      />
                      <div className="flex-1">
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">
                          {module.name}
                        </span>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                          {perm.name}
                        </div>
                        {perm.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {perm.description}
                          </div>
                        )}
                      </div>
                    </label>
                  )),
                )}
              </div>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

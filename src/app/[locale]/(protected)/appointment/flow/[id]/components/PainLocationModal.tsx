// PainLocationModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { RiCloseLine } from '@remixicon/react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/Dialog'
import { Divider } from '@/components/Divider'
import { Label } from '@/components/Label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/Select'
import Image from 'next/image'
import { PersonStanding } from 'lucide-react'
import { getOrganIcons } from '@/api/getOrganIcons'

interface OrganIcon {
  id: string
  name: string
  url: string
  size?: number
  mimetype?: string
}

export default function PainLocationModal() {
  const [icons, setIcons] = useState<OrganIcon[]>([])
  const [selectedPart, setSelectedPart] = useState<OrganIcon | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getOrganIcons()
      .then((data) => {
        setIcons(data as OrganIcon[])
      })
      .catch((err) => {
        console.error('Failed to load organ icons:', err)
        setError('Impossible de charger les icônes.')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <PersonStanding className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 sm:max-w-6xl">
        <DialogClose asChild>
          <Button
            className="absolute right-3 top-3 p-2 !text-gray-400 hover:text-gray-500 dark:!text-gray-600 hover:dark:text-gray-500"
            variant="ghost"
          >
            <RiCloseLine className="size-5 shrink-0" />
          </Button>
        </DialogClose>

        <DialogHeader className="border-b border-gray-200 px-6 py-4 dark:border-gray-900">
          <DialogTitle className="text-base font-semibold">
            Sélectionner la zone de douleur
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col-reverse md:flex-row">
          {/* Sidebar */}
          <div className="flex flex-col justify-between border-gray-200 dark:border-gray-900 md:w-80 md:border-r">
            <div className="flex-1 p-6 space-y-6">
              <div>
                <Label htmlFor="pain-type" className="font-medium">
                  Type de douleur
                </Label>
                <Select defaultValue="muscular">
                  <SelectTrigger id="pain-type" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="muscular">Musculaire</SelectItem>
                    <SelectItem value="articular">Articulaire</SelectItem>
                    <SelectItem value="nerve">Nerveuse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="pain-intensity" className="font-medium">
                  Intensité
                </Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="pain-intensity" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Forte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Divider />

              {selectedPart ? (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    {selectedPart.name}
                  </h4>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Sélectionnez un organe
                </p>
              )}
            </div>

            <div className="flex justify-between border-t border-gray-200 p-6 dark:border-gray-900">
              <Button variant="secondary">Annuler</Button>
              <Button disabled={!selectedPart}>Confirmer</Button>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 p-6 grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-[75vh]">
            {loading ? (
              <p className="col-span-full text-center text-sm text-gray-500">
                Chargement des organes...
              </p>
            ) : error ? (
              <p className="col-span-full text-center text-sm text-red-500">{error}</p>
            ) : icons.length === 0 ? (
              <p className="col-span-full text-center text-sm text-gray-500">
                Aucun organe trouvé.
              </p>
            ) : (
              icons.map((part) => (
                <Card
                  key={part.id}
                  onClick={() => setSelectedPart(part)}
                  className={`cursor-pointer transition-all border-2 p-4 ${
                    selectedPart?.id === part.id
                      ? 'border-blue-500 shadow-md'
                      : 'border-transparent hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative h-24 w-24">
                      <Image
                        src={part.url}
                        alt={part.name}
                        fill
                        className="object-contain"
                        unoptimized // SVG: disable Next.js optimization
                      />
                    </div>
                    <h4 className="text-sm font-medium text-center text-gray-900 dark:text-gray-100">
                      {part.name}
                    </h4>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
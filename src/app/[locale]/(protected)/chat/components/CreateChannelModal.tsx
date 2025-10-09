"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/Dialog'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { createChannel, ChatRoom } from '@/api/chat'
import { showToast } from '../../dashboard/hooks/utils'
import { MessageSquarePlus } from 'lucide-react'

export default function CreateChannelModal({
  tenantId,
  userId,
  onCreated,
}: {
  tenantId: string
  userId: string
  onCreated?: (room: ChatRoom) => void
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [members, setMembers] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!name.trim() || !tenantId || !userId) return
    setLoading(true)
    try {
      const list = members
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      const res = await createChannel(tenantId, name.trim(), userId, list)
      onCreated?.(res.data)
      showToast('success', 'Salon créé', `#${res.data.name}`)
      setOpen(false)
      setName('')
      setMembers('')
    } catch (e) {
      showToast('error', 'Erreur', "Impossible de créer le salon.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button  variant="primary" className='flex flex-row items-center mt-4'><MessageSquarePlus className="mr-2 h-4 w-4" />Nouveau salon</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau salon</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-3">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">Nom</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="ex. équipe-support" />
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">Membres (IDs séparés par des virgules)</label>
            <Input value={members} onChange={(e) => setMembers(e.target.value)} placeholder="u1,u2,u3" />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="secondary">Annuler</Button>
          </DialogClose>
          <Button onClick={handleCreate} disabled={!name.trim() || loading}>
            Créer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


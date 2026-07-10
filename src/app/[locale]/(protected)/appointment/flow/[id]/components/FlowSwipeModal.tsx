'use client'

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/Dialog"
import { Button } from "@/components/Button"
import { Delete, TextCursorInput } from "lucide-react"

interface DynamicFormStepProps {
  selectedFlow: any
  totalSteps: number
  showChangeModal: boolean
  onCloseModal: () => void
  onConfirmChange: (preserve: boolean) => void
}

export default function DynamicFormStep({
  showChangeModal,
  onCloseModal,
  onConfirmChange
}: DynamicFormStepProps) {

  return (
    <div>
      {showChangeModal && (
        <Dialog open={showChangeModal} onOpenChange={onCloseModal}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Changer de Flow</DialogTitle>
              <DialogDescription className="mt-1 text-sm leading-6">
                Vous avez déjà rempli des données. Souhaitez-vous les conserver dans le nouveau flow ou recommencer à zéro ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
              <DialogClose asChild>
                <Button variant="secondary" onClick={onCloseModal}>
                  Annuler
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="destructive" onClick={() => onConfirmChange(false)} className="flex flex-row items-center gap-2">
                <Delete width={18} />
                  Réinitialiser
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={() => onConfirmChange(true)} className="flex flex-row items-center gap-2">
                  <TextCursorInput width={18} />
                  Conserver
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

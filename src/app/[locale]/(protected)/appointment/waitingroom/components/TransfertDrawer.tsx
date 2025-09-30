import { Button } from '@/components/Button'
import {
    Drawer,
    DrawerBody,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from '@/components/Drawer'
import { ClipboardMinus, GitPullRequestCreateArrow } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const TransfertDrawer = () => {
    const hasAppointmentsToday = false // You can replace this with real logic or props

    return (
        <div>
            <Drawer>
                <DrawerTrigger asChild>
                    <Button>Ajouter à la salle d&apos;attente</Button>
                </DrawerTrigger>
                <DrawerContent className="sm:max-w-lg">
                    <DrawerHeader>
                        <DrawerTitle>Ajouter à la salle d&apos;attente</DrawerTitle>
                        <DrawerDescription className="mt-1 text-sm">
                            D&apos;après la liste des rendez-vous, vous pouvez ajouter un patient à la salle d&apos;attente
                        </DrawerDescription>
                    </DrawerHeader>
                    <DrawerBody>
                        {!hasAppointmentsToday ? (
                            <div className="flex flex-col gap-2 text-center space-y-4 h-full justify-center items-center">
                                <ClipboardMinus width={128} height={128} className='text-gray-300'/>
                                <p className="text-sm text-muted-foreground">
                                    Aucun rendez-vous trouvé à la date d&apos;aujourd&apos;hui
                                </p>
                                <Link href="/appointment/create">
                                    <Button className='flex flex-row gap-2'><GitPullRequestCreateArrow /> Créer un rendez-vous</Button>
                                </Link>
                            </div>
                        ) : (
                            <div>Contenu à afficher si des rendez-vous existent</div>
                        )}
                    </DrawerBody>
                    <DrawerFooter className="mt-6">
                        <DrawerClose asChild>
                            <Button
                                className="mt-2 w-full sm:mt-0 sm:w-fit"
                                variant="secondary"
                            >
                                Retour
                            </Button>
                        </DrawerClose>
                        <DrawerClose asChild>
                            <Button className="w-full sm:w-fit">Valider</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default TransfertDrawer

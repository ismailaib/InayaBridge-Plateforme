import { Button } from "@/components/Button"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/Drawer"

export const Conditions = () => (
  <div className="flex justify-center">
    <Drawer>
      <DrawerTrigger asChild>
        <a href="#" className="underline underline-offset-2">
          conditions d&apos;utilisation
        </a>
      </DrawerTrigger>
      <DrawerContent className="sm:max-w-lg">
        <DrawerHeader>
          <DrawerTitle>Conditions générales d&apos;utilisation</DrawerTitle>
          <DrawerDescription className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Merci de lire attentivement nos conditions avant d’utiliser la plateforme.
          </DrawerDescription>
        </DrawerHeader>

        <DrawerBody className="space-y-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <p>
            En accédant à notre plateforme, vous acceptez de respecter les
            présentes conditions d&apos;utilisation. Ces conditions visent à
            garantir une utilisation responsable, sécurisée et conforme aux
            normes éthiques de notre service.
          </p>

          <p>
            <strong>Protection des données :</strong> Vos informations
            personnelles sont traitées conformément à notre politique de
            confidentialité. Aucune donnée médicale n&apos;est partagée sans votre
            consentement explicite.
          </p>

          <p>
            <strong>Utilisation équitable :</strong> Toute tentative de fraude,
            d&apos;accès non autorisé ou d&apos;usage abusif des fonctionnalités est
            strictement interdite et entraînera la suspension immédiate du
            compte.
          </p>

          <p>
            <strong>Responsabilité :</strong> Les professionnels de santé sont
            seuls responsables des informations et des conseils qu&apos;ils
            communiquent sur la plateforme.
          </p>

          <p>
            En continuant, vous acceptez l&apos;ensemble des termes ci-dessus. Ces
            conditions peuvent être modifiées à tout moment, avec notification.
          </p>
        </DrawerBody>

        <DrawerFooter className="mt-6">
          <DrawerClose asChild>
            <Button variant="secondary" className="w-full sm:w-fit">
              Revenir
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button className="w-full sm:w-fit">J&apos;accepte</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </div>
)

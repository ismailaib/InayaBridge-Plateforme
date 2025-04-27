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

export const Politique = () => (
  <div className="flex justify-center">
    <Drawer>
      <DrawerTrigger asChild>
        <a href="#" className="underline underline-offset-2">
          politique de confidentialité
        </a>
      </DrawerTrigger>
      <DrawerContent className="sm:max-w-lg">
        <DrawerHeader>
          <DrawerTitle>Politique de confidentialité</DrawerTitle>
          <DrawerDescription className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Nous nous engageons à protéger vos données personnelles.
          </DrawerDescription>
        </DrawerHeader>

        <DrawerBody className="space-y-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <p>
            Votre vie privée est notre priorité. Cette politique explique
            comment nous collectons, utilisons et protégeons vos données
            personnelles.
          </p>

          <p>
            <strong>Données collectées :</strong> Nous recueillons uniquement
            les données nécessaires à l&apos;utilisation de nos services : nom,
            prénom, e-mail, date de naissance, et informations médicales si
            applicables.
          </p>

          <p>
            <strong>Utilisation des données :</strong> Les données sont utilisées
            pour personnaliser votre expérience, vous permettre d&apos;accéder à
            votre espace, et améliorer nos services.
          </p>

          <p>
            <strong>Stockage sécurisé :</strong> Vos informations sont
            stockées de manière sécurisée, avec des protocoles de chiffrement
            et d’accès restreint.
          </p>

          <p>
            <strong>Partage :</strong> Aucune donnée ne sera vendue ou partagée
            avec des tiers sans votre consentement explicite, sauf en cas
            d’obligation légale.
          </p>

          <p>
            Vous avez le droit de consulter, modifier ou supprimer vos données
            à tout moment. Pour toute question, contactez-nous à
            confidentialité@inayabridge.com.
          </p>
        </DrawerBody>

        <DrawerFooter className="mt-6">
          <DrawerClose asChild>
            <Button variant="secondary" className="w-full sm:w-fit">
              Fermer
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button className="w-full sm:w-fit">
              J&apos;ai compris
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </div>
)

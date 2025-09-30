import { Button } from '@/components/Button'
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/Dialog'
import { cx } from '@/lib/utils'
import { RiCheckboxCircleFill, RiCloseLine } from '@remixicon/react'
import { Wallet } from 'lucide-react'
import React, { useState } from 'react'

type Plan = {
  name: string
  price: string | { monthly: string; annually: string }
  description: string
  capacity: string[]
  features: string[]
  isStarter: boolean
  isRecommended: boolean
  buttonText: string
  buttonLink: string
}

const Pricing = () => {
  const [isOpen, setIsOpen] = useState(false)

  const plans: Plan[] = [
    {
      name: "Essentiel",
      price: { monthly: "0 Dh", annually: "0 Dh" },
      description:
        "Accédez à toutes les fonctionnalités de base. Idéal pour les professionnels débutants.",
      capacity: ["Consultations illimitées", "Messagerie", "Dossiers patients"],
      features: [
        "Gestion de RDV",
        "Consultations vidéo",
        "Historique médical complet",
      ],
      isStarter: true,
      isRecommended: false,
      buttonText: "Commencer gratuitement",
      buttonLink: "#",
    },
    {
      name: "Plus",
      price: { monthly: "140 Dh", annually: "1290 Dh" },
      description:
        "Des outils avancés pour optimiser votre pratique dès la version 2.",
      capacity: ["Statistiques patients", "Export PDF", "Support prioritaire"],
      features: [
        "Analyse de consultations",
        "Gestion des rappels automatiques",
        "Accès anticipé aux nouveautés",
      ],
      isStarter: false,
      isRecommended: false,
      buttonText: "Pré-inscription V2",
      buttonLink: "#",
    },
    {
      name: "Pro",
      price: { monthly: "290 Dh", annually: "2490 Dh" },
      description:
        "Pour les professionnels ou cliniques qui veulent tout centraliser.",
      capacity: ["Multi-profils", "Support premium", "Accès API (v2.1)"],
      features: [
        "Statistiques poussées",
        "Export de données patients",
        "Accès API & intégrations",
      ],
      isStarter: false,
      isRecommended: true,
      buttonText: "Pré-inscription V2",
      buttonLink: "#",
    },
  ]

  return (
    <div className="flex items-center justify-center pt-6">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="primary" className="w-full">
            <Wallet className="w-4 h-4 mr-2" />
            Choisir un plan d&apos;abonnement
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-6xl">
          <DialogClose asChild>
            <Button
              className="absolute right-3 top-3 p-2 !text-gray-400 hover:text-gray-500 dark:!text-gray-600 hover:dark:text-gray-500"
              variant="ghost"
            >
              <RiCloseLine className="size-5 shrink-0" />
            </Button>
          </DialogClose>

          <h3 className="font-semibold text-gray-900 dark:text-gray-50">
            Choisissez votre plan
          </h3>
          <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-500">
            Comparez nos offres et sélectionnez celle qui correspond à vos besoins.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={cx(
                  plan.isRecommended
                    ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950'
                    : 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900',
                  'border-t-2 p-6'
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold leading-8 text-gray-900 dark:text-gray-50">
                    {plan.name}
                  </h3>
                  {plan.isRecommended && (
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      Recommandé
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {plan.description}
                </p>
                <p className="mt-6 flex flex-col space-y-1">
                  {typeof plan.price === "string" ? (
                    <span className="text-3xl font-semibold text-gray-900 dark:text-gray-50">
                      {plan.price}
                    </span>
                  ) : (
                    <>
                      <span className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                        {plan.price.monthly} <span className="text-sm">/mois</span>
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {plan.price.annually} /an
                      </span>
                    </>
                  )}
                </p>

                <div className="mt-8">
                  <Button
                    asChild
                    variant={plan.isRecommended ? "primary" : "secondary"}
                    className="h-10 w-full"
                  >
                    <a href={plan.buttonLink}>{plan.buttonText}</a>
                  </Button>

                  <p className="mt-6 text-sm font-medium text-gray-900 dark:text-gray-50">
                    Capacités:
                  </p>
                  <ul
                    role="list"
                    className="mt-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {plan.capacity.map((item) => (
                      <li
                        key={item}
                        className="flex items-center space-x-2 py-2.5"
                      >
                        <RiCheckboxCircleFill
                          className={cx(
                            plan.isRecommended
                              ? 'text-emerald-500 dark:text-emerald-500'
                              : 'text-gray-400 dark:text-gray-600',
                            'size-5 shrink-0',
                          )}
                          aria-hidden={true}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-6 text-sm font-medium text-gray-900 dark:text-gray-50">
                    Fonctionnalités:
                  </p>
                  <ul
                    role="list"
                    className="mt-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center space-x-2 py-2.5"
                      >
                        <RiCheckboxCircleFill
                          className={cx(
                            plan.isRecommended
                              ? 'text-emerald-500 dark:text-emerald-500'
                              : 'text-gray-400 dark:text-gray-600',
                            'size-5 shrink-0',
                          )}
                          aria-hidden={true}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Pricing

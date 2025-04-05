import React from "react"
import { Badge } from "../Badge"

const stats = [
  {
    name: "Temps moyen de connexion",
    value: "< 3 sec",
  },
  {
    name: "Données chiffrées côté client & serveur",
    value: "100%",
  },
  {
    name: "Utilisateurs simultanés supportés",
    value: "+10 000",
  },
]

export default function Features() {
  return (
    <section
      aria-labelledby="features-title"
      className="mx-auto mt-44 w-full max-w-6xl px-3"
    >
      <Badge>Open, Fast & Secure</Badge>
      <h2
        id="features-title"
        className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
      >
        Conçue pour la rapidité, pensée pour la santé
      </h2>
      <p className="mt-6 max-w-3xl text-lg leading-7 text-gray-600 dark:text-gray-400">
        La plateforme InayaBridge est construite avec une architecture moderne
        et légère, pensée pour offrir des consultations fluides, même avec des
        connexions limitées. Nos choix techniques garantissent des performances
        stables, une sécurité renforcée, et une expérience utilisateur fiable —
        pour les médecins comme pour les patients.
      </p>
      <dl className="mt-12 grid grid-cols-1 gap-y-8 md:grid-cols-3 md:border-y md:border-gray-200 md:py-14 dark:border-gray-800">
        {stats.map((stat, index) => (
          <React.Fragment key={index}>
            <div className="border-l-2 border-green-100 pl-6 md:border-l md:text-center lg:border-gray-200 lg:first:border-none dark:border-[#003c30] lg:dark:border-gray-800">
              <dd className="inline-block bg-gradient-to-t from-[#003c30] to-[#009e7f] bg-clip-text text-5xl font-bold tracking-tight text-transparent lg:text-6xl dark:from-[#007e68] dark:to-[#33ccad]">
                {stat.value}
              </dd>
              <dt className="mt-1 text-gray-600 dark:text-gray-400">
                {stat.name}
              </dt>
            </div>
          </React.Fragment>
        ))}
      </dl>
    </section>
  )
}

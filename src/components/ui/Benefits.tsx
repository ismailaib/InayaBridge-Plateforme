const benefits = [
  {
    title: "Offrir un accès aux soins",
    description:
      "Chaque don permet à plus de patients d’accéder gratuitement à un médecin, sans frais cachés ni abonnement.",
  },
  {
    title: "Soutenir un projet libre",
    description:
      "InayaBridge est 100% gratuit et développé par une équipe passionnée. Vos dons financent le développement et l'hébergement.",
  },
  {
    title: "Préserver l’indépendance",
    description:
      "Pas de publicité. Pas de vente de données. Vos dons nous permettent de rester libres et centrés sur l’humain.",
  },
  {
    title: "Équiper les médecins",
    description:
      "Nous aidons les médecins à suivre et accompagner leurs patients avec des outils simples et efficaces.",
  },
  {
    title: "Investir dans l’avenir",
    description:
      "Chaque fonctionnalité, chaque amélioration, chaque mise à jour… est propulsée par le soutien de la communauté.",
  },
  {
    title: "Impact réel, concret",
    description:
      "Votre don peut faire la différence pour une famille dans une zone rurale ou un patient isolé.",
  },
  {
    title: "Transparence totale",
    description:
      "Tous les financements sont traçables et utilisés pour le projet uniquement. Zéro bullshit.",
  },
  {
    title: "Participer à un mouvement",
    description:
      "Ce n’est pas juste un projet. C’est un pont vers une nouvelle façon de penser la santé. Rejoignez-le.",
  },
]

export default function Benefits() {
  return (
    <section aria-labelledby="benefits-title" className="mx-auto mt-44">
      <h2
        id="benefits-title"
        className="inline-block bg-gradient-to-t from-gray-900 to-gray-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent md:text-5xl dark:from-gray-50 dark:to-gray-300"
      >
        On l’a lancé. Vous pouvez l’amplifier.{" "}
      </h2>
      <dl className="mt-8 grid grid-cols-4 gap-x-10 gap-y-8 sm:mt-12 sm:gap-y-10">
        {benefits.map((benefit, index) => (
          <div key={index} className="col-span-4 sm:col-span-2 lg:col-span-1">
            <dt className="font-semibold text-gray-900 dark:text-gray-50">
              {benefit.title}
            </dt>
            <dd className="mt-2 leading-7 text-gray-600 dark:text-gray-400">
              {benefit.description}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

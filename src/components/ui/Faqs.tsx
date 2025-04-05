"use client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../Accordion"

const faqs = [
  {
    question: "Est-ce que la plateforme est gratuite pour les patients ?",
    answer:
      "Oui, InayaBridge est et restera entièrement gratuite pour les patients. Aucune carte bancaire, aucun abonnement, aucun engagement.",
  },
  {
    question: "Les médecins doivent-ils payer pour utiliser la plateforme ?",
    answer:
      "Non, toutes les fonctionnalités sont gratuites dans la version actuelle (V1). Dans les futures versions, des outils avancés (statistiques, exports, API) seront proposés via des offres payantes.",
  },
  {
    question: "Comment les consultations en ligne sont-elles sécurisées ?",
    answer:
      "Les consultations utilisent un protocole de chiffrement de bout en bout. Vos appels ne sont ni enregistrés, ni partagés. Notre priorité : la confidentialité médicale.",
  },
  {
    question: "Peut-on accéder à la plateforme sur mobile ?",
    answer:
      "Oui, InayaBridge fonctionne depuis n'importe quel navigateur moderne, sur ordinateur, tablette ou smartphone. Aucun téléchargement requis.",
  },
  {
    question: "Comment rejoindre la plateforme en tant que médecin ?",
    answer:
      "Il suffit de créer un compte professionnel. Vous pouvez commencer à consulter dès validation de votre profil. C’est simple, rapide, et sans frais cachés.",
  },
]

export function Faqs() {
  return (
    <section className="mt-20 sm:mt-36" aria-labelledby="faq-title">
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-14">
        <div className="col-span-full sm:col-span-5">
          <h2
            id="faq-title"
            className="inline-block scroll-my-24 bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 pr-2 text-2xl font-bold tracking-tighter text-transparent lg:text-3xl dark:from-gray-50 dark:to-gray-300"
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-400">
            Can&rsquo;t find the answer you&rsquo;re looking for? Don&rsquo;t
            hesitate to get in touch with our{" "}
            <a
              href="#"
              className="font-medium text-[#009e7f] hover:text-[#66d9c2] dark:text-[#33ccad]"
            >
              customer support
            </a>{" "}
            team.
          </p>
        </div>
        <div className="col-span-full mt-6 lg:col-span-7 lg:mt-0">
          <Accordion type="multiple" className="mx-auto">
            {faqs.map((item) => (
              <AccordionItem
                value={item.question}
                key={item.question}
                className="py-3 first:pb-3 first:pt-0"
              >
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

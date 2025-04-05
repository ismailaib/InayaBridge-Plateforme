import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import Benefits from "@/components/ui/Benefits"
import { cx } from "@/lib/utils"
import Balancer from "react-wrap-balancer"

export default function About() {
  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      <section
        aria-labelledby="about-overview"
        className="animate-slide-up-fade"
        style={{
          animationDuration: "600ms",
          animationFillMode: "backwards",
        }}
      >
        <Badge>À propos</Badge>
        <h1
          id="about-overview"
          className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
        >
          <Balancer>
            Nous sommes des étudiants, des bâtisseurs, des humains.
          </Balancer>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-700 dark:text-gray-400">
          La santé devrait être accessible à tous. InayaBridge est née d’un
          constat simple : dans de nombreuses régions, consulter un médecin
          reste un défi.
          <br /> Alors nous avons décidé de créer l’outil que nous aurions aimé
          voir exister — une plateforme libre, humaine, et connectée.
        </p>
      </section>
      <Benefits />
      <section aria-labelledby="vision-title" className="mx-auto mt-40">
        <h2
          id="vision-title"
          className="inline-block bg-gradient-to-t from-gray-900 to-gray-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent md:text-5xl dark:from-gray-50 dark:to-gray-300"
        >
          Notre vision
        </h2>
        <div className="mt-6 max-w-prose space-y-4 text-gray-600 dark:text-gray-400">
          <p className="text-lg leading-8">
            Nous rêvons d’un monde où la santé n’est pas freinée par la
            distance, la technique ou les moyens. Un monde où une simple
            connexion suffit pour recevoir de l’aide, du soin, de l’écoute.
          </p>
          <p className="text-lg leading-8">
            Avec InayaBridge, nous voulons bâtir un pont entre les patients et
            les médecins, entre la technologie et l’humain, entre les besoins et
            les solutions.
          </p>
          <p className="text-lg leading-8">
            C’est une vision ambitieuse, mais elle commence ici — avec vous.
          </p>
          <p
            className={cx(
              "w-fit rotate-3 font-handwriting text-3xl text-[#009e7f] dark:text-[#33ccad]",
            )}
          >
            - L&apos;équipe InayaBridge
          </p>
        </div>
        <Button className="mt-32 h-10 w-full shadow-xl shadow-[#00b38f]/20">
          Faire un don maintenant
        </Button>
      </section>
    </div>
  )
}

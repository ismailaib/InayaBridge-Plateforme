import Code from "@/components/Code"
import {
  RiLinksLine,
  RiPlugLine,
  RiShieldKeyholeLine,
  RiStackLine,
} from "@remixicon/react"
import { Badge } from "../Badge"
import CodeExampleTabs from "./CodeExampleTabs"

const code = `POST /api/appointment
Content-Type: application/json

{
  "patientId": "1234",
  "doctorId": "5678",
  "date": "2025-05-15",
  "time": "14:30",
  "reason": "Suivi général",
  "notes": "Patient présente des symptômes légers depuis 3 jours"
}
`

const code2 = `async function startVideoConsultation(patientId, doctorId) {
  try {
    const response = await fetch('/api/video/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: \`Bearer \${localStorage.getItem('token')}\`
      },
      body: JSON.stringify({ patientId, doctorId })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(\`Erreur lors du démarrage de la consultation : \${error}\`);
    }

    const { roomId, expiresAt } = await response.json();

    console.log(\`Salle créée : \${roomId} (Expire à \${expiresAt})\`);
    window.location.href = \`/call/\${roomId}\`;
  } catch (err) {
    console.error(err.message);
    alert("Impossible de démarrer la consultation vidéo.");
  }
}
`

const features = [
  {
    name: "Prise de rendez-vous simplifiée",
    description:
      "Réservez une consultation en ligne en quelques clics, sans file d'attente ni déplacement.",
    icon: RiStackLine,
  },
  {
    name: "Consultation vidéo sécurisée",
    description:
      "Participez à des rendez-vous médicaux en visio, avec une qualité optimisée et des connexions chiffrées.",
    icon: RiPlugLine,
  },
  {
    name: "Dossiers et documents médicaux",
    description:
      "Partagez et accédez à vos ordonnances, résultats et diagnostics en toute simplicité.",
    icon: RiLinksLine,
  },
  {
    name: "Respect total de la confidentialité",
    description:
      "Toutes vos données sont stockées et traitées conformément au RGPD avec une sécurité de niveau clinique.",
    icon: RiShieldKeyholeLine,
  },
]

export default function CodeExample() {
  const title = "Un outil gratuit, né d’un besoin réel";
  const description = "InayaBridge a été créé pour répondre à une injustice simple : trop de personnes n’ont pas accès aux soins médicaux de qualité. Dans les zones rurales, pour les personnes âgées ou à mobilité réduite, se déplacer jusqu'à un médecin est parfois un obstacle. C’est pourquoi nous avons conçu une plateforme entièrement gratuite, sans publicité, financée par la communauté et ouverte à tous. La santé ne devrait jamais être un privilège.";
  return (
    <section
      aria-labelledby="code-example-title"
      data-section-title={title}
      className="mx-auto mt-28 w-full max-w-6xl px-3"
    >
      <Badge>InayaBridge</Badge>
      <h2 className="mt-2 inline-block text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
        {title}
      </h2>
      <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
        {description}
      </p>
      <CodeExampleTabs
        tab1={
          <Code code={code} lang="http" copy={false} className="h-[31rem]" />
        }
        tab2={
          <Code
            code={code2}
            lang="javascript"
            copy={false}
            className="h-[31rem]"
          />
        }
      />
      <dl className="mt-24 grid grid-cols-4 gap-10">
        {features.map((item) => (
          <div
            key={item.name}
            className="col-span-full sm:col-span-2 lg:col-span-1"
          >
            <div className="w-fit rounded-lg p-2 ring-1 ring-black/5 dark:shadow-[#3b82f6]/30 dark:ring-white/5">
              <item.icon
                aria-hidden="true"
                className="size-6 text-[#3b82f6] dark:text-[#3b82f6]"
              />
            </div>
            <dt className="mt-6 font-semibold text-gray-900 dark:text-gray-50">
              {item.name}
            </dt>
            <dd className="mt-2 leading-7 text-gray-600 dark:text-gray-400">
              {item.description}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

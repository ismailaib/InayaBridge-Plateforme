import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

const data = [
  {
    step: 1,
    title: 'Compléter les informations professionnelles',
    description:
      'Ajoutez votre spécialité, votre numéro d’ordre et votre adresse professionnelle.',
    buttonText: 'Compléter le profil',
    disabled: false,
    tooltipText: '',
  },
  {
    step: 2,
    title: 'Ajouter vos disponibilités',
    description:
      'Indiquez vos jours et heures de consultation pour permettre la prise de rendez-vous.',
    buttonText: 'Configurer mes horaires',
    disabled: true,
    tooltipText: 'Complétez d’abord votre profil',
  },
  {
    step: 3,
    title: 'Activer votre compte',
    description:
      'Une fois les informations complètes, vous pouvez accéder au tableau de bord.',
    buttonText: 'Activer mon compte',
    disabled: true,
    tooltipText: 'Ajoutez vos disponibilités d’abord',
  },
];

export default function DoctorOnboarding() {
  return (
    <>
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Finalisez votre inscription
        </h3>
        <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-500">
          Pour accéder pleinement au tableau de bord, veuillez compléter les étapes suivantes.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <div
              key={item.title}
              className="flex flex-col justify-between border-l-2 border-blue-100 py-1 pl-4 dark:border-[#3b82f6]/20"
            >
              <div>
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-[#3b82f6] dark:bg-[#3b82f6]/20 dark:text-[#3b82f6]">
                  Étape {item.step}
                </span>
                <h4 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-50">
                  {item.title}
                </h4>
                <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-500">
                  {item.description}
                </p>
              </div>
              <Button disabled={item.disabled} className="mt-8">
                {item.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

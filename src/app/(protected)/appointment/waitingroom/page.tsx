import React from "react"
import CardsView from "./components/CardsView"

const page = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
        Créer un rendez-vous
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Sélectionnez un patient existant ou ajoutez-en un nouveau.
      </p>
      <CardsView />
    </div>
  )
}

export default page

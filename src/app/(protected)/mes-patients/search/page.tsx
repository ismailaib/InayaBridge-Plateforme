import React from 'react'
import Filter from './components/Filter'
import Add from './components/Add'

const page = () => {
  return (
   <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="mb-4 flex flex-col items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Géstion des patients
          </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Ici vous pouvez consulter tous vos patients et générer un rapport
            </p>
        </div>
        <Add />
      </div>
      <Filter />
    </div>
  )
}

export default page
// src/app/appointments/[id]/components/LoadingState.tsx
export const LoadingState = () => (
    <div className="flex items-center justify-center h-screen">
        <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Chargement des détails...</p>
        </div>
    </div>
);
export const getValidDate = (value?: string) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const getStatusLabel = (status?: string) => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return "En attente";
    case "CONFIRMED":
      return "Confirmé";
    case "CANCELLED":
      return "Annulé";
    case "ARRIVED":
      return "Arrivé";
    case "IN_PROGRESS":
      return "En cours";
    case "COMPLETED":
      return "Terminé";
    default:
      return status || "Inconnu";
  }
};

export const getStatusDotColor = (status?: string) => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return "bg-yellow-500";
    case "CONFIRMED":
      return "bg-green-500";
    case "CANCELLED":
      return "bg-red-500";
    case "ARRIVED":
      return "bg-indigo-500";
    case "IN_PROGRESS":
      return "bg-blue-500";
    case "COMPLETED":
      return "bg-emerald-600";
    default:
      return "bg-gray-500";
  }
};

export const getConsultationType = (type?: string) => {
  switch (type?.toUpperCase()) {
    case "LOCAL":
      return { label: "Cabinet principal" };
    case "IN_PERSON":
      return { label: "À domicile" };
    case "VIDEO":
      return { label: "Visio conférence" };
    default:
      return { label: type || "Non spécifié" };
  }
};

export const getConsultationDotColor = (type?: string) => {
  switch (type?.toUpperCase()) {
    case "LOCAL":
      return "bg-blue-500";
    case "IN_PERSON":
      return "bg-emerald-500";
    case "VIDEO":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
};

export const getGenderLabel = (gender?: string) => {
  switch (gender?.toLowerCase()) {
    case "male":
      return "Homme";
    case "female":
      return "Femme";
    default:
      return gender || "Non spécifié";
  }
};

export const formatTime = (time?: string) => {
  if (!time) return "--";
  const parts = time.split(":");
  return `${parts[0]}:${parts[1]}`;
};

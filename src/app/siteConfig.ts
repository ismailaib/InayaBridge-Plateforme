export const siteConfig = {
  name: "InayaBridge",
  url: "https://inayabridge.com",
  description: "La santé accessible. Pour tous, partout.",
} as const;

// Use a helper for locale-aware paths (used in components, not in metadata)
export const makeLinks = (locale?: string) => {
  const prefix = locale ? `/${locale}` : "";
  return {
    home: "/",
    about: `${prefix}/about`,
    changelog: `${prefix}/changelog`,
    pricing: `${prefix}/pricing`,
    imprint: `${prefix}/imprint`,
    privacy: `${prefix}/privacy`,
    terms: `${prefix}/terms`,
    login: `${prefix}/login`,
  } as const;
};

export type SiteConfig = typeof siteConfig;

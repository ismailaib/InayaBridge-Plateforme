export function extractApiError(err: any): string {
  const fallback = "Une erreur est survenue lors de la connexion.";
  // Avoid direct property access that may throw
  console.error("API Error:", err?.response?.data ?? err?.data ?? err);
  try {
    if (!err || typeof err !== "object") return fallback;
    const anyErr = err as any;
    const data = anyErr?.response?.data ?? anyErr?.data ?? null;

    if (data) {
      if (typeof data.message === "string" && data.message.trim()) return data.message;

      if (data.details && typeof data.details === "object") {
        const parts: string[] = [];
        for (const v of Object.values(data.details)) {
          if (Array.isArray(v)) parts.push(v.filter(Boolean).map(String).join(" | "));
          else if (typeof v === "string" && v.trim()) parts.push(v);
          else if (v != null) parts.push(String(v));
        }
        if (parts.length) return parts.join(" | ");
      }

      if (typeof data.error === "string" && data.error.trim()) return data.error;
    }

    if (typeof anyErr.message === "string" && anyErr.message.trim()) return anyErr.message;
    return fallback;
  } catch {
    return fallback;
  }
}

import { useEffect, useState } from "react";

export const useUserTenant = () => {
  const [tenantId, setTenantId] = useState("");

  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      const tenantId = user ? JSON.parse(user)?.doctorProfile?.tenantId : null;
      if (tenantId) setTenantId(tenantId);
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

  return tenantId;
};

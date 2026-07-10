
import { getServicesByTenant, Service } from '@/api/services';
import { useQuery } from '@tanstack/react-query';

export function useServices(tenantId: string | null) {
  return useQuery<Service[], Error>({
    queryKey: ['services', tenantId],
    queryFn: async () => {
      if (!tenantId) {
        return [];
      }
      const res = await getServicesByTenant(tenantId);
      return res.data;
    },
    enabled: !!tenantId,
  });
}

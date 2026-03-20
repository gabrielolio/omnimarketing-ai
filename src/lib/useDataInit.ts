import { useEffect, useRef } from 'react';
import { useClientsStore } from '@/src/stores/useClientsStore';
import { useContractsStore } from '@/src/stores/useContractsStore';
import { useAutomationsStore } from '@/src/stores/useAutomationsStore';
import { useAgentsStore } from '@/src/stores/useAgentsStore';
import { useCalendarStore } from '@/src/stores/useCalendarStore';
import { usePipelineStore } from '@/src/stores/usePipelineStore';
import { useAppStore } from '@/src/stores/useAppStore';

export function useDataInit() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Fetch all data from Supabase in parallel
    Promise.allSettled([
      useClientsStore.getState().fetchClients(),
      useContractsStore.getState().fetchContracts(),
      useAutomationsStore.getState().fetchAutomations(),
      useAgentsStore.getState().fetchAgents(),
      useCalendarStore.getState().fetchPosts(),
      usePipelineStore.getState().fetchLeads(),
      useAppStore.getState().fetchNotifications(),
    ]).then((results) => {
      const failed = results.filter((r) => r.status === 'rejected');
      if (failed.length > 0) {
        console.warn(`${failed.length} data fetches failed. Using cached/local data.`);
      }
    });
  }, []);
}

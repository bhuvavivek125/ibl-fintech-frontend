import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { getBreRuleList, updateBreRuleStatus, updateBreRuleValue } from 'api/bre-rule';
import { BRE_MODULE_TYPE, RuleValue, BRERule } from 'types/bre-rule';

interface UseBreRulesReturn {
  rules: BRERule[];
  loading: boolean;
  activeCount: number;
  inactiveCount: number;
  ruleIndexMap: Record<string, number>;
  fetchRules: () => Promise<void>;
  handleToggle: (id: string, isActive: boolean) => Promise<void>;
  handleSaveValue: (id: string, value: RuleValue) => Promise<void>;
}

export function useBreRules(currentModule: BRE_MODULE_TYPE): UseBreRulesReturn {
  const [rules, setRules] = useState<BRERule[]>([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const fetchRules = useCallback(async () => {
    setLoading(true);
    setRules([]);
    try {
      const response: any = await getBreRuleList(currentModule);
      if (response.success) setRules(response.data);
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || 'Failed to fetch BRE rules', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [currentModule, enqueueSnackbar]);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const handleToggle = useCallback(
    async (id: string, isActive: boolean) => {
      // Optimistic update
      setRules((prev) => prev.map((r) => (r._id === id ? { ...r, isActive } : r)));
      try {
        await updateBreRuleStatus(id, isActive);
        enqueueSnackbar(`Rule ${isActive ? 'activated' : 'deactivated'}`, { variant: 'success' });
      } catch (err: any) {
        // Rollback on failure
        setRules((prev) => prev.map((r) => (r._id === id ? { ...r, isActive: !isActive } : r)));
        enqueueSnackbar(err?.response?.data?.message || 'Failed to update status', { variant: 'error' });
      }
    },
    [enqueueSnackbar]
  );

  const handleSaveValue = useCallback(
    async (id: string, value: RuleValue) => {
      // Optimistic update - save previous state for rollback
      const prevRules = rules;

      // Update the rule with both value and config changes
      setRules((prev) => {
        const updated = prev.map((r) => {
          if (r._id !== id) return r;

          const newRule = { ...r, value: { ...r.value, ...value } };

          // Also update config if variables were modified
          if ((value as any).variables) {
            newRule.config = { ...r.config, ...(value as any).variables };
          }

          return newRule;
        });
        return updated;
      });

      try {
        await updateBreRuleValue(id, value);
        enqueueSnackbar('Rule value updated', { variant: 'success' });

        // Re-fetch the specific rule to ensure UI is in sync
        try {
          const allRules: any = await getBreRuleList(currentModule);
          if (allRules.success) {
            const updatedRule = allRules.data.find((r: BRERule) => r._id === id);
            if (updatedRule) {
              setRules((prev) => prev.map((r) => (r._id === id ? updatedRule : r)));
            }
          }
        } catch (refetchErr) {
          console.error('Failed to refetch updated rule:', refetchErr);
        }
      } catch (err: any) {
        // Rollback on failure
        console.error('❌ Error updating rule:', err);
        setRules(prevRules);
        enqueueSnackbar(err?.response?.data?.message || 'Failed to update value', { variant: 'error' });
      }
    },
    [rules, currentModule, enqueueSnackbar]
  );

  const { activeCount, inactiveCount } = useMemo(() => {
    const a = rules.filter((r) => r.isActive).length;
    return { activeCount: a, inactiveCount: rules.length - a };
  }, [rules]);

  const ruleIndexMap = useMemo(() => Object.fromEntries(rules.map((r, i) => [r._id, i])), [rules]);

  return { rules, loading, activeCount, inactiveCount, ruleIndexMap, fetchRules, handleToggle, handleSaveValue };
}

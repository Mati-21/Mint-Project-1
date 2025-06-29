// Helper to flatten nested KPI structure
export function flattenAssignedKpis(assignedKpis) {
  const result = [];

  for (const [goalId, goalData] of Object.entries(assignedKpis)) {
    const { goal_desc, kras } = goalData;

    for (const [kraId, kraData] of Object.entries(kras || {})) {
      const { kpis } = kraData;

      (kpis || []).forEach((kpi) => {
        result.push({
          goal_id: goalId,
          goal_desc,

          kra_id: kraId,
          kra_name: kraData.kra_name || "",

          kpi_id: kpi._id,
          kpi_name: kpi.kpi_name,
        });
      });
    }
  }

  return result;
}

export function transformAssignmentArray(dataArray) {
  return dataArray.map((data) => {
    const firstKpi = data.kpiData?.[0] || {};

    return {
      assignedUser: {
        fullName: data.assignedUser?.fullName || "",
        role: data.assignedUser?.role || "",
        id: data.assignedUser?._id || "",
      },
      KpiData: {
        goalId: firstKpi.goal?.goal_id || "",
        goalDes: firstKpi.goal?.goal_desc || "",
        kraId: firstKpi.kra?.kra_id || "",
        kraName: firstKpi.kra?.kra_name || "",
        kpiId: firstKpi.kpi?.kpi_id || "",
        kpiName: firstKpi.kpi?.kpi_name || "",
      },
      measure: data.measure || "",
      performed: data.performed || false,
      quarter: data.quarter || "",
      target: data.target || 0,
      updatedAt: data.updatedAt || "",
      year: data.year || "",
      __v: data.__v || 0,
      _id: data._id || "",
    };
  });
}

const API_BASE_URL = "http://localhost:8000";

export async function getDashboardSummary() {
  const response = await fetch(
    `${API_BASE_URL}/api/government/dashboard-summary`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard summary");
  }

  return response.json();
}
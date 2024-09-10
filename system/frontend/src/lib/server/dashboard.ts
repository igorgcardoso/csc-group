import { api } from "../api";
import { Dashboard } from "./models";

export async function getDashboardData() {
  const response = await api.get<Dashboard>("/dashboard");
  return response.data;
}

export function dashboardKeys() {
  return ["dashboard"];
}

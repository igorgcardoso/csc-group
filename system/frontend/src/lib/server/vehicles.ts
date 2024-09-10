import { api } from "../api";
import { Vehicle } from "./models";

export async function getVehicles() {
  const response = await api.get<{ vehicles: Vehicle[] }>("/vehicles");
  return response.data;
}

export function vehicleKeys(vehicleId?: number) {
  const keys = ["vehicle"];
  if (vehicleId) {
    keys.push(vehicleId.toString());
  }

  return keys;
}

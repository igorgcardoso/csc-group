import { api } from "../api";
import { VehicleModel } from "./models";

export async function getVehicleModels() {
  const response = await api.get<{ models: VehicleModel[] }>("/vehicle-models");
  return response.data;
}

export async function createVehicleModel(data: {
  name: string;
}): Promise<{ id: number }> {
  const response = await api.post<{ id: number }>("/vehicle-models", data);

  return response.data;
}

export async function deleteVehicleModel(modelId: number) {
  await api.delete(`/vehicle-models/${modelId}`);
}

export function vehicleModelsKeys(vehicleModelId?: number) {
  const keys = ["vehicle-models"];
  if (vehicleModelId) {
    keys.push(vehicleModelId.toString());
  }

  return keys;
}

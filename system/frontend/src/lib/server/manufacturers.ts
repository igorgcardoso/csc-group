import { api } from "../api";
import { Manufacturer } from "./models";

export async function listManufacturers() {
  const response = await api.get<{ manufacturers: Manufacturer[] }>(
    "/manufacturers",
  );
  return response.data;
}

export async function createManufacturer(data: {
  name: string;
}): Promise<{ id: number }> {
  const response = await api.post<{ id: number }>("/manufacturers", data);

  return response.data;
}

export async function deleteManufacturer(manufacturerId: number) {
  await api.delete(`/manufacturers/${manufacturerId}`);
}

export function manufacturersKeys(manufacturerId?: number) {
  const keys = ["manufacturers"];
  if (manufacturerId) {
    keys.push(manufacturerId.toString());
  }

  return keys;
}

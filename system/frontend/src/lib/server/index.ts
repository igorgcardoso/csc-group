import { dashboardKeys, getDashboardData } from "./dashboard";
import {
  createManufacturer,
  deleteManufacturer,
  listManufacturers,
  manufacturersKeys,
} from "./manufacturers";
import { getVehicles, vehicleKeys } from "./vehicles";
import {
  createVehicleModel,
  getVehicleModels,
  vehicleModelsKeys,
} from "./vehicles-models";

export const server = {
  vehicles: {
    list: getVehicles,
    keys: vehicleKeys,
  },
  vehicleModels: {
    list: getVehicleModels,
    create: createVehicleModel,
    keys: vehicleModelsKeys,
  },
  manufacturers: {
    list: listManufacturers,
    create: createManufacturer,
    delete: deleteManufacturer,
    keys: manufacturersKeys,
  },
  dashboard: {
    data: getDashboardData,
    keys: dashboardKeys,
  },
};

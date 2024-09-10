export interface Manufacturer {
  id: number;
  name: string;
}

export interface VehicleModel {
  id: number;
  name: string;
  manufacturer: Manufacturer;
}

export type Status = "active" | "inactive" | "maintenance" | "broken";

export interface Vehicle {
  id: number;
  model: VehicleModel;
  year: number;
  licensePlate: string;
  status: Status;
}

export interface Dashboard {
  passengersByMonth: {
    month: string;
    count: number;
  }[];
  fuelByMonth: {
    month: string;
    quantity: number;
  }[];
  maintenanceByMonth: {
    month: string;
    count: number;
  }[];
  incidentsByMonth: {
    month: string;
    amount: number;
  }[];
  costByMonth: {
    month: string;
    cost: number;
  }[];
}

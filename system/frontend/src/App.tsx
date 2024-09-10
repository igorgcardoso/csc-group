import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard } from "./pages/dashboard";
import { Home } from "./pages/home";
import { Manufacturers } from "./pages/manufacturer";
import { NewManufacturer } from "./pages/manufacturer/new";
import { VehicleModels } from "./pages/vehicle-models";
import { NewModel } from "./pages/vehicle-models/new";
import { Vehicles } from "./pages/vehicles";
import { NewVehicle } from "./pages/vehicles/new";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/vehicles",
    element: <Vehicles />,
  },
  {
    path: "/vehicles/new",
    element: <NewVehicle />,
  },
  {
    path: "/models",
    element: <VehicleModels />,
  },
  {
    path: "/models/new",
    element: <NewModel />,
  },
  {
    path: "/manufacturers",
    element: <Manufacturers />,
  },
  {
    path: "/manufacturers/new",
    element: <NewManufacturer />,
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="dark">
        <RouterProvider router={router} />
      </div>
    </QueryClientProvider>
  );
}

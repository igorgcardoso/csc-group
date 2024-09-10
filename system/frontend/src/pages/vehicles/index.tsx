import { Header } from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";
import { server } from "@/lib/server";
import { useQuery } from "@tanstack/react-query";
import { VehicleCard } from "./vehicle-card";

export function Vehicles() {
  const { data, isLoading } = useQuery({
    queryKey: server.vehicles.keys(),
    queryFn: server.vehicles.list,
  });

  return (
    <div className="min-h-screen w-screen">
      <Header title="Veículos" onAdd={() => {}} />
      <div className="p-10">
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <div className="flex w-full flex-col items-center justify-between gap-4">
            {data?.vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                status={vehicle.status}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

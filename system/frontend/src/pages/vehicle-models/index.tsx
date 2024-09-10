import { Header } from "@/components/header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { server } from "@/lib/server";
import { deleteVehicleModel } from "@/lib/server/vehicles-models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function VehicleModels() {
  const { data, isLoading } = useQuery({
    queryKey: server.vehicleModels.keys(),
    queryFn: server.vehicleModels.list,
  });

  const queryClient = useQueryClient();

  const { mutate: deleteModel, isPending } = useMutation({
    mutationFn: deleteVehicleModel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: server.vehicleModels.keys() });
    },
  });

  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-screen">
      <Header
        title="Modelos de Veículo"
        onAdd={() => navigate("/models/new")}
      />
      <div className="p-10">
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <div className="space-y-3">
            {data?.models.map((model) => (
              <div
                key={model.id}
                className="flex items-center justify-between rounded bg-slate-900 px-4 py-1"
              >
                <div className="space-x-4">
                  <span className="text-lg font-semibold uppercase leading-relaxed">
                    {model.name}
                  </span>
                  <span className="text-sm uppercase text-slate-600">
                    {model.manufacturer.name}
                  </span>
                </div>
                <div className="space-x-4">
                  <Button variant="ghost" disabled={isPending}>
                    <Pencil className="size-5 text-yellow-500" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger className="transition-opacity hover:opacity-70">
                      <Trash2 className="size-5 text-red-500" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Apagar modelo "{model.name}"
                        </AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteModel(model.id)}
                          disabled={isPending}
                        >
                          Apagar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

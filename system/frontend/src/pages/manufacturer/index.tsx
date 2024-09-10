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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Manufacturers() {
  const { data, isLoading } = useQuery({
    queryKey: server.manufacturers.keys(),
    queryFn: server.manufacturers.list,
  });

  const queryClient = useQueryClient();

  const { mutate: deleteManufacturer, isPending } = useMutation({
    mutationFn: server.manufacturers.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: server.manufacturers.keys() });
    },
  });

  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-screen">
      <Header
        title="Fabricantes"
        onAdd={() => navigate("/manufacturers/new")}
      />
      <div className="p-10">
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <div className="space-y-3">
            {data?.manufacturers.map((manufacturer) => (
              <div
                key={manufacturer.id}
                className="flex items-center justify-between rounded bg-slate-900 px-4 py-1"
              >
                <span className="text-lg font-semibold uppercase leading-relaxed">
                  {manufacturer.name}
                </span>
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
                          Apagar fabricante "{manufacturer.name}"
                        </AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteManufacturer(manufaturer.id)}
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

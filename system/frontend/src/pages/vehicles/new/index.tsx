import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { server } from "@/lib/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const newVehicleSchema = z.object({
  identifier: z.string().min(4),
  model: z.coerce.number().positive(),
  year: z.number().positive(),
  licensePlate: z.string().min(7),
});

export function NewVehicle() {
  const form = useForm<z.infer<typeof newVehicleSchema>>({
    resolver: zodResolver(newVehicleSchema),
  });

  const navigate = useNavigate();

  const { data: models } = useQuery({
    queryKey: server.vehicleModels.keys(),
    queryFn: server.vehicleModels.list,
  });

  async function handleCreate(data: z.infer<typeof newVehicleSchema>) {}

  return (
    <div>
      <Header title="Novo Veículo" withoutAdd />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreate)}
          className="mx-auto mt-10 max-w-screen-md space-y-4"
        >
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identificador</FormLabel>
                <FormControl>
                  <Input placeholder="Veículo 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Select
                      value={String(field.value)}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="text-black">
                        <SelectValue placeholder="Modelo" />
                      </SelectTrigger>
                      <Suspense fallback={<Skeleton className="size-full" />}>
                        <SelectContent>
                          {models?.map((model) => (
                            <SelectItem key={model.id} value={String(model.id)}>
                              {model.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Suspense>
                    </Select>
                  </FormControl>
                  <FormMessage />
                  <Button
                    type="button"
                    className="rounded bg-transparent p-2 hover:bg-slate-800"
                    onClick={() => navigate("/models/new")}
                  >
                    <Plus className="size-6 text-green-500" />
                  </Button>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano</FormLabel>
                <FormControl>
                  <Input
                    placeholder="2021"
                    {...field}
                    type="number"
                    min={1930}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="licensePlate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Placa</FormLabel>
                <FormControl>
                  <Input placeholder="ABC-1234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full bg-green-700 hover:bg-green-900">
            Salvar
          </Button>
        </form>
      </Form>
    </div>
  );
}

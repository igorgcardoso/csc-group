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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const newModelSchema = z.object({
  name: z.string().min(1),
  manufacturerId: z.coerce.number(),
});

export function NewModel() {
  const form = useForm<z.infer<typeof newModelSchema>>({
    resolver: zodResolver(newModelSchema),
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof newModelSchema>) => {
      await server.vehicleModels.create(data);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: server.vehicleModels.keys() });
    },
  });

  const { data: manufacturers } = useQuery({
    queryKey: server.manufacturers.keys(),
    queryFn: server.manufacturers.list,
  });

  const navigate = useNavigate();

  return (
    <div>
      <Header title="Novo Modelo" withoutAdd />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(mutate)}
          className="mx-auto mt-10 max-w-screen-md space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="M3 Competition" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="manufacturerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fabricante</FormLabel>
                <div className="flex gap-2">
                  <div className="w-full">
                    <FormControl>
                      <Select
                        value={String(field.value)}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Fabricante" />
                        </SelectTrigger>
                        <Suspense fallback={<Skeleton className="size-full" />}>
                          <SelectContent>
                            {manufacturers?.manufacturers.map(
                              (manufacturer) => (
                                <SelectItem
                                  key={manufacturer.id}
                                  value={String(manufacturer.id)}
                                >
                                  {manufacturer.name}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Suspense>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </div>
                  <Button
                    type="button"
                    className="rounded bg-transparent p-2 hover:bg-slate-800"
                    onClick={() => navigate("/manufacturers/new")}
                  >
                    <Plus className="size-6 text-green-500" />
                  </Button>
                </div>
              </FormItem>
            )}
          />
          <Button
            className="w-full bg-green-700 hover:bg-green-900"
            disabled={isPending}
          >
            Salvar
          </Button>
        </form>
      </Form>
    </div>
  );
}

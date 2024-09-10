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
import { server } from "@/lib/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

const newManufacturerSchema = z.object({
  name: z.string().min(3),
});

export function NewManufacturer() {
  const form = useForm<z.infer<typeof newManufacturerSchema>>({
    resolver: zodResolver(newManufacturerSchema),
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof newManufacturerSchema>) => {
      await server.manufacturers.create(data);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: server.manufacturers.keys() });
    },
  });

  return (
    <div>
      <Header title="Novo Fabricante" withoutAdd />
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
                  <Input placeholder="BMW" {...field} />
                </FormControl>
                <FormMessage />
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

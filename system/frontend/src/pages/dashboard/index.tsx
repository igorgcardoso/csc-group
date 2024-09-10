import { Header } from "@/components/header";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { server } from "@/lib/server";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

dayjs.locale("pt-br");

export function Dashboard() {
  const { data } = useQuery({
    queryKey: server.dashboard.keys(),
    queryFn: server.dashboard.data,
  });

  return (
    <div className="min-h-screen w-screen">
      <Header title="Dashboard" withoutAdd />

      <div className="mt-10 flex flex-wrap items-center space-y-12 px-5">
        <div className="max-h-[400px] w-1/2 space-y-4">
          <span className="ml-14 text-2xl font-bold">Custo por mês</span>
          {data ? (
            <ChartContainer
              config={{} as ChartConfig}
              className="max-h-[400px] w-full"
            >
              <LineChart accessibilityLayer data={data?.costByMonth}>
                <Line type="monotone" dataKey="cost" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(value) => dayjs(value, "MM").format("MMM")}
                />
                <YAxis />
              </LineChart>
            </ChartContainer>
          ) : (
            <Skeleton className="max-h-[400px] w-full" />
          )}
        </div>
        <div className="max-h-[400px] w-1/2 space-y-4">
          <span className="ml-14 text-2xl font-bold">Passageiros por mês</span>
          {data ? (
            <ChartContainer
              config={{} as ChartConfig}
              className="max-h-[380px] w-full"
            >
              <LineChart accessibilityLayer data={data?.passengersByMonth}>
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(value) => dayjs(value, "MM").format("MMM")}
                />
                <YAxis />
              </LineChart>
            </ChartContainer>
          ) : (
            <Skeleton className="max-h-[400px] w-full" />
          )}
        </div>
        <div className="w-1/3 space-y-4">
          <span className="ml-14 text-2xl font-bold">Incidêntes por mês</span>
          {data ? (
            <ChartContainer
              config={{} as ChartConfig}
              className="max-h-[400px]"
            >
              <LineChart accessibilityLayer data={data?.incidentsByMonth}>
                <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(value) => dayjs(value, "MM").format("MMM")}
                />
                <YAxis />
              </LineChart>
            </ChartContainer>
          ) : (
            <Skeleton className="max-h-[400px] w-full" />
          )}
        </div>
        <div className="w-1/3 space-y-4">
          <span className="ml-14 text-2xl font-bold">Manutenções por mês</span>
          {data ? (
            <ChartContainer
              config={{} as ChartConfig}
              className="max-h-[400px]"
            >
              <LineChart accessibilityLayer data={data?.maintenanceByMonth}>
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(value) => dayjs(value, "MM").format("MMM")}
                />
                <YAxis />
              </LineChart>
            </ChartContainer>
          ) : (
            <Skeleton className="max-h-[400px] w-full" />
          )}
        </div>
        <div className="w-1/3 space-y-4">
          <span className="ml-14 text-2xl font-bold">Combustível por mês</span>
          {data ? (
            <ChartContainer
              config={{} as ChartConfig}
              className="max-h-[400px]"
            >
              <LineChart accessibilityLayer data={data?.fuelByMonth}>
                <Line type="monotone" dataKey="quantity" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(value) => dayjs(value, "MM").format("MMM")}
                />
                <YAxis />
              </LineChart>
            </ChartContainer>
          ) : (
            <Skeleton className="max-h-[400px] w-full" />
          )}
        </div>
      </div>
    </div>
  );
}

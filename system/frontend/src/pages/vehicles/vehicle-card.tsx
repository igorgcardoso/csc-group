import { Vehicle } from "@/lib/server/models";
import { tv, VariantProps } from "tailwind-variants";

const VehicleCardVariants = tv({
  base: "w-full max-w-md rounded flex justify-between items-center p-4 hover:opacity-70 transition-opacity",

  variants: {
    status: {
      active: "bg-green-800",
      inactive: "bg-neutral-700",
      maintenance: "bg-amber-600",
      broken: "bg-red-800",
    },
  },

  defaultVariants: {
    status: "active",
  },
});

interface VehicleCardProps extends VariantProps<typeof VehicleCardVariants> {
  vehicle: Vehicle;
}

export function VehicleCard({ status, vehicle }: VehicleCardProps) {
  return (
    <button className={VehicleCardVariants({ status })}>
      <div className="space-x-2">
        <span>{vehicle.licensePlate}</span>
        <span className="text-sm text-slate-300">
          {vehicle.model.manufacturer.name} {vehicle.model.name} {vehicle.year}
        </span>
      </div>
    </button>
  );
}

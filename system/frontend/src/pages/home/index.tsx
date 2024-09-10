import {
  Bus,
  ChartLine,
  Compass,
  Fuel,
  ShieldAlert,
  SquareUser,
  UserRoundCog,
  Wrench,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NavButton } from "./nav-button";

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center gap-4">
      <NavButton title="Dashboard" onClick={() => navigate("/dashboard")}>
        <ChartLine className="size-6" />
        Dashboard
      </NavButton>
      <NavButton title="Veículos" onClick={() => navigate("/vehicles")}>
        <Bus className="size-6" />
        Veículos
      </NavButton>
      <NavButton title="Veículos" onClick={() => navigate("/models")}>
        <Bus className="size-6" />
        Modelos de Veículos
      </NavButton>
      <NavButton title="Veículos" onClick={() => navigate("/manufacturers")}>
        <Bus className="size-6" />
        Fabricantes de Veículos
      </NavButton>
      <NavButton
        title="Motoristas"
        onClick={() => navigate("/drivers")}
        disabled
      >
        <SquareUser className="size-6" />
        Motoristas
      </NavButton>
      <NavButton
        title="Mecânicos"
        onClick={() => navigate("/mechanics")}
        disabled
      >
        <UserRoundCog className="size-6" />
        Mecânicos
      </NavButton>
      <NavButton
        title="Manutenções"
        onClick={() => navigate("/maintenances")}
        disabled
      >
        <Wrench className="size-6" />
        Manutenções
      </NavButton>
      <NavButton title="Combustível" onClick={() => navigate("/fuel")} disabled>
        <Fuel className="size-6" />
        Combustível
      </NavButton>
      <NavButton title="Rotas" onClick={() => navigate("/routes")} disabled>
        <Compass className="size-6" />
        Rotas
      </NavButton>
      <NavButton
        title="Incidentes"
        onClick={() => navigate("/incidents")}
        disabled
      >
        <ShieldAlert className="size-6" />
        Incidentes
      </NavButton>
    </div>
  );
}

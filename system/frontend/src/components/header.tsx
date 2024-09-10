interface HeaderProps {
  title: string;
  onAdd?: () => void;
  withoutAdd?: boolean;
}

export function Header({ onAdd, title, withoutAdd = false }: HeaderProps) {
  return (
    <div className="flex w-full items-center justify-around border-b border-slate-600 py-2">
      <h1 className="text-lg font-bold">{title}</h1>
      {withoutAdd ? <div /> : <button onClick={onAdd}>Adicionar</button>}
    </div>
  );
}

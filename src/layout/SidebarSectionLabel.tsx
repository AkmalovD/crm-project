interface SidebarSectionLabelProps {
  title: string;
  isOpen: boolean;
}

export default function SidebarSectionLabel({ title, isOpen }: SidebarSectionLabelProps) {
  if (!isOpen) return <div className="my-2 mx-3 h-px bg-slate-200" aria-hidden="true" />;

  return (
    <h3 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
      {title}
    </h3>
  );
}

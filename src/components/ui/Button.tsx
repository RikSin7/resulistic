type ButtonProps = {
  children: React.ReactNode;
  className?: string;
};

export function Button({ children, className = "" }: ButtonProps) {
  return (
    <button
      className={`rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 ${className}`}
    >
      {children}
    </button>
  );
}

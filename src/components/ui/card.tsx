export function Card({ className = '', children, ...props }: any) {
  return (
    <div
      className={`rounded-lg border border-border bg-card text-card-foreground shadow-elevation-1 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', ...props }: any) {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />;
}

export function CardTitle({ className = '', ...props }: any) {
  return <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props} />;
}

export function CardContent({ className = '', ...props }: any) {
  return <div className={`p-6 pt-0 ${className}`} {...props} />;
}
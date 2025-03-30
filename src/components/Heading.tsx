type Props = {
  title: string;
  description: string;
};

export function Heading({ title, description }: Props) {
  return (
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

interface SectionTitleProps {
  title: string;
}

export default function SectionTitle({ title }: SectionTitleProps) {
  return <h3 className="text-lg font-medium mb-2">{title}</h3>;
}
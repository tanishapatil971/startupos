type CardProps = {
  title: string;
  children: React.ReactNode;
};

export default function Card({ title, children }: CardProps) {
  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="font-semibold mb-2">{title}</h2>
      {children}
    </div>
  );
}
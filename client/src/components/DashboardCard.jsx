export default function DashboardCard({ title, value, color }) {
  return (
    <div className="p-6 bg-white shadow rounded-xl border">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className={`text-2xl font-bold mt-2 ${color}`}>{value}</h2>
    </div>
  );
}

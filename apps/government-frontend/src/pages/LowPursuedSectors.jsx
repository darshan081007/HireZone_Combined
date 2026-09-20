import DashboardLayout from "../components/layout/DashboardLayout";

function LowPursuedSectors() {
  const sectors = [
    {
      sector: "Agricultural Technology",
      students: 18,
      demand: "High",
    },
    {
      sector: "Public Policy Analytics",
      students: 12,
      demand: "High",
    },
    {
      sector: "Environmental Engineering",
      students: 21,
      demand: "Medium",
    },
    {
      sector: "Urban Planning",
      students: 9,
      demand: "High",
    },
    {
      sector: "Defence Research",
      students: 14,
      demand: "Medium",
    },
  ];

  return (
    <DashboardLayout>
      <div className="surface-card rounded-2xl bg-white p-6">
        <h1 className="mb-4 text-2xl font-bold text-[#176B3A]">
          Low-Pursued Sectors
        </h1>

        <table className="w-full border">
          <thead className="bg-green-100">
            <tr>
              <th className="p-3 border">Sector</th>
              <th className="p-3 border">Students</th>
              <th className="p-3 border">Industry Demand</th>
            </tr>
          </thead>

          <tbody>
            {sectors.map((sector, index) => (
              <tr key={index}>
                <td className="p-3 border">{sector.sector}</td>
                <td className="p-3 border">{sector.students}</td>
                <td className="p-3 border">{sector.demand}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default LowPursuedSectors;
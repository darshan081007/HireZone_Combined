import DashboardLayout from "../components/layout/DashboardLayout";

function RegionalDistribution() {
  const regions = [
    {
      region: "Tamil Nadu",
      students: 520,
      recruiters: 48,
    },
    {
      region: "Karnataka",
      students: 450,
      recruiters: 41,
    },
    {
      region: "Maharashtra",
      students: 390,
      recruiters: 37,
    },
    {
      region: "Kerala",
      students: 280,
      recruiters: 19,
    },
    {
      region: "Telangana",
      students: 310,
      recruiters: 26,
    },
  ];

  return (
    <DashboardLayout>
      <div className="surface-card rounded-2xl bg-white p-6">
        <h1 className="mb-4 text-2xl font-bold text-[#176B3A]">
          Regional Distribution
        </h1>

        <table className="w-full border">
          <thead className="bg-green-100">
            <tr>
              <th className="p-3 border">Region</th>
              <th className="p-3 border">Students</th>
              <th className="p-3 border">Recruiters</th>
            </tr>
          </thead>

          <tbody>
            {regions.map((region, index) => (
              <tr key={index}>
                <td className="p-3 border">{region.region}</td>
                <td className="p-3 border">{region.students}</td>
                <td className="p-3 border">{region.recruiters}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default RegionalDistribution;
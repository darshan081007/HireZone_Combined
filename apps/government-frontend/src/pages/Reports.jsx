import DashboardLayout from "../components/layout/DashboardLayout";

function Reports() {
  const reports = [
    {
      title: "National Skill Gap Report",
      date: "10-09-2026",
      status: "Published",
    },
    {
      title: "Industry Demand Analysis",
      date: "05-09-2026",
      status: "Published",
    },
    {
      title: "Regional Workforce Assessment",
      date: "28-08-2026",
      status: "Published",
    },
    {
      title: "Government Recruitment Trends",
      date: "15-08-2026",
      status: "Published",
    },
  ];

  return (
    <DashboardLayout>
      <div className="surface-card rounded-2xl bg-white p-6">
        <h1 className="mb-4 text-2xl font-bold text-[#176B3A]">
          Government Reports
        </h1>

        <table className="w-full border">
          <thead className="bg-green-100">
            <tr>
              <th className="p-3 border">Report Title</th>
              <th className="p-3 border">Published Date</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report, index) => (
              <tr key={index}>
                <td className="p-3 border">{report.title}</td>
                <td className="p-3 border">{report.date}</td>
                <td className="p-3 border">{report.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default Reports;
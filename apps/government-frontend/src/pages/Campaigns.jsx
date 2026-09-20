import DashboardLayout from "../components/layout/DashboardLayout";

function Campaigns() {
  const campaigns = [
    {
      name: "Digital Skills for India",
      start: "01-09-2026",
      end: "31-12-2026",
      status: "Active",
    },
    {
      name: "AI Workforce Readiness",
      start: "15-08-2026",
      end: "30-11-2026",
      status: "Active",
    },
    {
      name: "Rural Tech Enablement",
      start: "01-07-2026",
      end: "30-09-2026",
      status: "Ongoing",
    },
  ];

  return (
    <DashboardLayout>
      <div className="surface-card rounded-2xl bg-white p-6">
        <h1 className="mb-4 text-2xl font-bold text-[#176B3A]">
          Government Campaigns
        </h1>

        <table className="w-full border">
          <thead className="bg-green-100">
            <tr>
              <th className="p-3 border">Campaign Name</th>
              <th className="p-3 border">Start Date</th>
              <th className="p-3 border">End Date</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {campaigns.map((campaign, index) => (
              <tr key={index}>
                <td className="p-3 border">{campaign.name}</td>
                <td className="p-3 border">{campaign.start}</td>
                <td className="p-3 border">{campaign.end}</td>
                <td className="p-3 border">{campaign.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default Campaigns;
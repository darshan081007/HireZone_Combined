import DashboardLayout from "../components/layout/DashboardLayout";

function Projects() {
  const projects = [
    {
      student_id: 101,
      student_name: "Arun Kumar",
      project: "Smart Transport Tracker",
    },
    {
      student_id: 102,
      student_name: "Priya S",
      project: "AI Resume Analyzer",
    },
    {
      student_id: 103,
      student_name: "Karthik R",
      project: "HireZone Portal",
    },
  ];

  return (
    <DashboardLayout>
      <div className="rounded-2xl border border-[#D5E8DA] bg-white shadow-sm">
        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-bold text-[#176B3A]">
            Student Projects
          </h2>
        </div>

        <table className="w-full">
          <thead className="bg-[#F3F8F4]">
            <tr>
              <th className="px-6 py-4 text-left">Student ID</th>
              <th className="px-6 py-4 text-left">Student Name</th>
              <th className="px-6 py-4 text-left">Project</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((item) => (
              <tr key={item.student_id} className="border-t">
                <td className="px-6 py-4">{item.student_id}</td>
                <td className="px-6 py-4">{item.student_name}</td>
                <td className="px-6 py-4">{item.project}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default Projects;
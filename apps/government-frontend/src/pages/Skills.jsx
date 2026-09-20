import DashboardLayout from "../components/layout/DashboardLayout";

function Skills() {
  const skills = [
    {
      student_id: 101,
      student_name: "Arun Kumar",
      skills: "React, Java, SQL",
    },
    {
      student_id: 102,
      student_name: "Priya S",
      skills: "Python, Machine Learning, Data Analysis",
    },
    {
      student_id: 103,
      student_name: "Karthik R",
      skills: "Node.js, MongoDB, Express",
    },
  ];

  return (
    <DashboardLayout>
      <div className="rounded-2xl border border-[#D5E8DA] bg-white shadow-sm">
        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-bold text-[#176B3A]">
            Skills Intelligence
          </h2>
          <p className="text-sm text-gray-600">
            Student skills across the platform.
          </p>
        </div>

        <table className="w-full">
          <thead className="bg-[#F3F8F4]">
            <tr>
              <th className="px-6 py-4 text-left">Student ID</th>
              <th className="px-6 py-4 text-left">Student Name</th>
              <th className="px-6 py-4 text-left">Skills</th>
            </tr>
          </thead>

          <tbody>
            {skills.map((item) => (
              <tr key={item.student_id} className="border-t">
                <td className="px-6 py-4">{item.student_id}</td>
                <td className="px-6 py-4">{item.student_name}</td>
                <td className="px-6 py-4">{item.skills}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default Skills;
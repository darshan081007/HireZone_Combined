import { useEffect, useState } from "react";
import { Users, Search, MapPin, GraduationCap, RefreshCw } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Tooltip from "../components/ui/Tooltip";
import { EmptyState } from "../components/ui/States";
import { getStudents } from "../services/governmentService";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);

    try {
      const response = await getStudents();

      const studentsData = Array.isArray(response.data) ? response.data : [];

      const uniqueStudents = Array.from(
        new Map(
          studentsData.map((student) => [student.student_id, student])
        ).values()
      );

      setStudents(uniqueStudents);
    } catch (error) {
      console.error("Failed to load students:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const query = search.toLowerCase();

    return (
      String(student.student_id).includes(query) ||
      (student.student_name || "").toLowerCase().includes(query) ||
      (student.college_name || "").toLowerCase().includes(query) ||
      (student.location || "").toLowerCase().includes(query)
    );
  });

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Student Intelligence"
        title="Students Directory"
        description="Browse registered students and verified academic records across institution campuses."
        icon={Users}
        actions={
          <Button variant="secondary" icon={RefreshCw} onClick={loadStudents}>
            Refresh
          </Button>
        }
      />

      {/* Top Banner */}
      <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl bg-[#176B3A] p-6 text-white shadow-md md:flex-row md:items-center border border-[#9AD9B1]">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <Users size={26} />
          </div>

          <div>
            <p className="text-xs text-white/80">Registered Candidates</p>
            <p className="mt-0.5 text-3xl font-extrabold">{students.length}</p>
          </div>
        </div>

        <div className="text-xs text-white/80 flex items-center gap-1.5">
          <span>Verified Student Directory</span>
          <Tooltip text="Verified via university registration records." />
        </div>
      </div>

      {/* Directory Table */}
      <section className="card-hover-elevation surface-card overflow-hidden rounded-2xl border border-[#D5E8DA] bg-white">
        <div className="flex flex-col justify-between gap-4 border-b border-[#D5E8DA] p-5 md:flex-row md:items-center md:p-6">
          <div>
            <h2 className="text-lg font-bold text-[#176B3A]">
              Student Directory
            </h2>
            <p className="mt-0.5 text-xs text-[#6B7280]">
              {filteredStudents.length} candidate records matching current search.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
            />
            <input
              type="text"
              placeholder="Search by ID, name, college, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#D5E8DA] bg-[#F3FBF5] py-2 pl-9 pr-4 text-xs font-medium text-[#24352A] outline-none transition focus:border-[#176B3A] focus:ring-2 focus:ring-[#9AD9B1]/40"
            />
          </div>
        </div>

        <div className="thin-scroll overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead className="bg-[#F3FBF5]">
              <tr className="border-b border-[#D5E8DA] text-xs uppercase tracking-wider text-[#7A5535]">
                <th className="px-6 py-3.5 font-bold">Student ID</th>
                <th className="px-6 py-3.5 font-bold">Name</th>
                <th className="px-6 py-3.5 font-bold">College</th>
                <th className="px-6 py-3.5 font-bold">Location</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-[#D5E8DA]">
                    {Array.from({ length: 4 }).map((__, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 w-full max-w-[160px] skeleton-shimmer rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr
                    key={student.student_id}
                    className="border-t border-[#D5E8DA] transition-colors hover:bg-[#9AD9B1]/10 text-sm"
                  >
                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-[#9AD9B1]/20 px-2.5 py-1 text-xs font-bold text-[#176B3A]">
                        #{student.student_id}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#9AD9B1]/30 text-[#176B3A]">
                          <GraduationCap size={17} />
                        </div>
                        <span className="font-bold text-[#24352A]">
                          {student.student_name || "—"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-medium text-[#6B7280]">
                      {student.college_name || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-[#6B7280]">
                        <MapPin size={14} className="text-[#176B3A]" />
                        {student.location || "—"}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-10">
                    <EmptyState
                      title="No student records found"
                      description="Try adjusting your search criteria."
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Students;
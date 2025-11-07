import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useForm } from "../../stores/userForm";
import { useAuth } from "../../stores/useAuth";
import { SubmissionRow } from "../../components/submissionUser";
import { ExportExce } from "../../components/exportExcel";

export default function FormDetail() {
  const { getUser } = useAuth();
  const { formId } = useParams({ from: "/admin/form/$formId" });
  const { getSubmissionForm } = useForm();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSubmissionForm(formId);

      setSubmissions(data);
    };
    fetchData();
  }, [formId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Danh sách lượt trả lời</h1>
      <ExportExce submissions={submissions} formId={formId} getUser={getUser} />
      <p className="text-gray-600 mt-1 mb-3">
        Tổng số bài nộp:{" "}
        <span className="font-semibold">{submissions.length}</span>
      </p>

      {submissions.length === 0 ? (
        <p className="text-gray-500 italic">Chưa có ai nộp bài.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 table-fixed text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 w-[50px] text-center">#</th>
                <th className="p-3 w-[200px]">Người dùng</th>
                <th className="p-3 w-[100px] text-center">Điểm</th>
                <th className="p-3 w-[180px]">Thời gian nộp</th>
                <th className="p-3 w-[100px] text-center">Chi tiết</th>
              </tr>
            </thead>

            <tbody>
              {submissions.map((sub, i) => (
                <SubmissionRow
                  key={sub.id}
                  sub={sub}
                  i={i}
                  openIndex={openIndex}
                  setOpenIndex={setOpenIndex}
                  getUser={getUser}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

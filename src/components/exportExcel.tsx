import { useEffect, useState } from "react";
import { exportExcel } from "../utils/excel";
import { ArrowDownToLine } from "lucide-react";

export function ExportExce({ submissions }: any) {
  const handleExportExcel = () => {
    const formatted = submissions.map((s, i) => ({
      STT: i + 1,
      UserEmail: s.userEmail,
      Điểm: s.totalScore,
      "Thời gian nộp": new Date(s.submitAt).toLocaleString(),
      ...s.answers, // thêm từng câu trả lời vào cột
    }));
    exportExcel(formatted, `Form_Submissions`);
  };
  return (
    <div>
      {submissions.length > 0 && (
        <button
          onClick={handleExportExcel}
          className="bg-black text-white px-4 py-2 rounded-lg hover:scale-[1.02] cursor-pointer">
          <span className="flex justify-start">
            <ArrowDownToLine className="mr-2" />
            <p> Xuất Excel</p>
          </span>
        </button>
      )}
    </div>
  );
}

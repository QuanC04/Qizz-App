import { useEffect, useState } from "react";
import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "../stores/useAuth";
import { useForm, type Question } from "../stores/useForm";

export default function FormDetail() {
  const { getUser } = useAuth();
  const formId = "aH7zclGdlaQ6FogCXDAqh";
  const { getSubmissionForm, getForm } = useForm();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [form, setForm] = useState<any>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const COLORS = ["#3b82f6", "#ec4899", "#fbbf24", "#10b981"];

  const rangeData = [
    { day: "05-01", temperature: [-1, 10] },
    { day: "05-02", temperature: [2, 15] },
    { day: "05-03", temperature: [3, 12] },
    { day: "05-04", temperature: [4, 12] },
    { day: "05-05", temperature: [12, 16] },
    { day: "05-06", temperature: [5, 16] },
    { day: "05-07", temperature: [3, 12] },
    { day: "05-08", temperature: [0, 8] },
    { day: "05-09", temperature: [-3, 5] },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSubmissionForm(formId);
      setSubmissions(data);
      const form = await getForm(formId);
      setForm(form);
    };
    fetchData();
  }, [formId]);

  // === Thống kê điểm ===
  const scores = submissions.map((s) => s.totalScore || 0);
  const averageScore =
    scores.length > 0
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
      : 0;
  const highestScore = scores.length ? Math.max(...scores) : 0;

  // === Thống kê từng câu hỏi ===
  const questionStats =
    form?.questions?.map((q: Question, qi: number) => {
      const answers = submissions.map((s) => s.answers?.[qi]);
      const counts = q.options.map(
        (opt: string) => answers.filter((a) => a === opt).length
      );
      const total = submissions.length || 1;
      const correctAnswerText = q.options[q.correctAnswer];
      const correctCount = answers.filter(
        (a) => a === correctAnswerText
      ).length;
      const correctPercent = ((correctCount / total) * 100).toFixed(0);

      // Chuẩn hoá dữ liệu cho biểu đồ
      const chartData = q.options.map((opt, i) => ({
        name: opt,
        value: counts[i],
      }));

      return {
        questionText: q.questionText,
        score: q.score,
        chartData,
        options: q.options.map((opt, i) => ({
          label: opt,
          count: counts[i],
          isCorrect: i === q.correctAnswer,
        })),
        correctRate: correctPercent,
      };
    }) || [];

  // === Biểu đồ xu hướng điểm ===
  const submissionTimeline = submissions
    .map((sub, idx) => ({
      name: `Lượt ${idx + 1}`,
      score: sub.totalScore || 0,
      time: sub.submitAt || "N/A",
    }))
    .slice(0, 10);

  return (
    // <div className="p-6 bg-gray-50 min-h-screen">
    //   <div className="mb-8">
    //     <h1 className="text-3xl font-bold mb-2 text-gray-800">
    //       Danh sách lượt trả lời
    //     </h1>
    //     <ExportExce
    //       submissions={submissions}
    //       formId={formId}
    //       getUser={getUser}
    //     />
    //   </div>

    //   {/* === Tổng quan === */}
    //   <div className="grid grid-cols-3 gap-4 mb-8">
    //     <div className="bg-white p-6 rounded-lg shadow">
    //       <p className="text-gray-600 text-sm mb-1">Phản hồi</p>
    //       <p className="text-3xl font-bold text-blue-600">
    //         {submissions.length}
    //       </p>
    //     </div>
    //     <div className="bg-white p-6 rounded-lg shadow">
    //       <p className="text-gray-600 text-sm mb-1">Điểm trung bình</p>
    //       <p className="text-3xl font-bold text-green-600">{averageScore}</p>
    //     </div>
    //     <div className="bg-white p-6 rounded-lg shadow">
    //       <p className="text-gray-600 text-sm mb-1">Điểm cao nhất</p>
    //       <p className="text-3xl font-bold text-purple-600">{highestScore}</p>
    //     </div>
    //   </div>

    //   {submissions.length === 0 ? (
    //     <p className="text-gray-500 italic text-center py-8">
    //       Chưa có ai nộp bài.
    //     </p>
    //   ) : (
    //     <>
    //       {/* === Biểu đồ từng câu hỏi === */}
    //       <div className="grid grid-cols-2 gap-6 mb-8">
    //         {questionStats.map((question, idx) => (
    //           <div
    //             key={idx}
    //             className="p-6 rounded-2xl shadow-sm bg-white max-w-2xl">
    //             <h2 className="text-lg font-medium mb-1">
    //               {idx + 1}. {question.questionText}{" "}
    //               <span className="text-gray-500">({question.score} điểm)</span>
    //             </h2>

    //             <p className="text-sm text-blue-600 mb-4">
    //               {question.correctRate}% người trả lời đúng.
    //             </p>

    //             <div className="flex items-center justify-between">
    //               <div>
    //                 {question.options.map((opt, i) => (
    //                   <div key={i} className="flex items-center gap-2 mb-2">
    //                     <div
    //                       className="w-3 h-3 rounded-full"
    //                       style={{
    //                         backgroundColor: COLORS[i % COLORS.length],
    //                       }}></div>
    //                     <span>{opt.label}</span>
    //                     <span className="text-gray-600 ml-2">
    //                       ({opt.count})
    //                     </span>
    //                     {opt.isCorrect && (
    //                       <Check className="w-4 h-4 text-green-500 ml-1" />
    //                     )}
    //                   </div>
    //                 ))}
    //               </div>

    //               <div className="relative">
    //                 <PieChart width={150} height={150}>
    //                   <Pie
    //                     data={question.chartData}
    //                     cx="50%"
    //                     cy="50%"
    //                     innerRadius={45}
    //                     outerRadius={60}
    //                     paddingAngle={1}
    //                     dataKey="value">
    //                     {question.chartData.map((_, i) => (
    //                       <Cell key={i} fill={COLORS[i % COLORS.length]} />
    //                     ))}
    //                   </Pie>
    //                   <Tooltip />
    //                 </PieChart>

    //                 <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-700">
    //                   {question.correctRate}%
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         ))}

    //         {/* === Biểu đồ điểm theo thời gian === */}
    //         <div className="bg-white p-6 rounded-lg shadow">
    //           <h2 className="text-lg font-semibold mb-4 text-gray-800">
    //             Xu hướng điểm (10 lượt gần nhất)
    //           </h2>
    //           <ResponsiveContainer width="100%" height={300}>
    //             <LineChart data={submissionTimeline}>
    //               <CartesianGrid strokeDasharray="3 3" />
    //               <XAxis dataKey="name" />
    //               <YAxis />
    //               <Tooltip />
    //               <Legend />
    //               <Line
    //                 type="monotone"
    //                 dataKey="score"
    //                 stroke="#8b5cf6"
    //                 dot={{ fill: "#8b5cf6" }}
    //               />
    //             </LineChart>
    //           </ResponsiveContainer>
    //         </div>
    //       </div>

    //       {/* === Bảng chi tiết === */}
    //       <div className="bg-white rounded-lg shadow overflow-hidden">
    //         <div className="p-6 border-b border-gray-200">
    //           <h2 className="text-lg font-semibold text-gray-800">
    //             Chi tiết bài nộp
    //           </h2>
    //         </div>
    //         <div className="overflow-x-auto">
    //           <table className="w-full border-collapse text-left">
    //             <thead className="bg-gray-100 border-b border-gray-300">
    //               <tr>
    //                 <th className="p-3 text-center text-sm font-semibold">#</th>
    //                 <th className="p-3 text-sm font-semibold">Người dùng</th>
    //                 <th className="p-3 text-center text-sm font-semibold">
    //                   Điểm
    //                 </th>
    //                 <th className="p-3 text-sm font-semibold">Thời gian nộp</th>
    //                 <th className="p-3 text-center text-sm font-semibold">
    //                   Chi tiết
    //                 </th>
    //               </tr>
    //             </thead>
    //             <tbody>
    //               {submissions.map((sub, i) => (
    //                 <SubmissionRow
    //                   key={sub.id}
    //                   sub={sub}
    //                   i={i}
    //                   openIndex={openIndex}
    //                   setOpenIndex={setOpenIndex}
    //                   getUser={getUser}
    //                 />
    //               ))}
    //             </tbody>
    //           </table>
    //         </div>
    //       </div>
    //     </>
    //   )}
    // </div>
    <BarChart
      style={{
        width: "100%",
        maxWidth: "700px",
        maxHeight: "70vh",
        aspectRatio: 1.618,
      }}
      responsive
      data={rangeData}
      margin={{
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      }}>
      <XAxis dataKey="day" />
      <YAxis width="auto" />
      <Tooltip />
      <Bar dataKey="temperature" fill="#8884d8" />
    </BarChart>
  );
}

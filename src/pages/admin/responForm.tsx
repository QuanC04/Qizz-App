import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../../stores/useAuth";
import { useForm, type Question } from "../../stores/useForm";

import { Check } from "lucide-react";
import { Cell, Pie, PieChart, Tooltip } from "recharts";

import QuestionResult from "@/components/questionText";

export default function FormDetail() {
  const { getUser } = useAuth();
  const { formId } = useParams({ from: "/form/$formId" });
  const { getSubmissionForm, getForm } = useForm();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [form, setForm] = useState<any>(null);

  const COLORS = [
    "#3b82f6",
    "#ec4899",
    "#fbbf24",
    "#10b981",
    "#8b5cf6",
    "#f43f5e",
  ];

  useEffect(() => {
    const fetchData = async () => {
      const submissionData = await getSubmissionForm(formId);
      setSubmissions(submissionData);
      const formData = await getForm(formId);
      setForm(formData);
    };
    fetchData();
  }, [formId]);

  // % câu trả lời
  const renderCustomLabel = (entry: { percent: number }) => {
    const percent = Math.round(entry.percent * 100);
    if (percent === 0) return null; // ẩn 0%
    return `${percent}%`;
  };

  const scores = submissions.map((s) => s.totalScore || 0);
  const avgScore =
    scores.length > 0
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
      : 0;
  const maxScore = scores.length > 0 ? Math.max(...scores) : 0;

  // --- Thống kê từng câu hỏi ---
  const questionStats = form?.questions?.map((q: Question, qi: number) => {
    // Câu trong submission dạng "Câu 1", "Câu 2"...
    const answerKey = `Câu ${qi + 1}`;

    const answers = submissions.map((s) => {
      const ansObj = s.answers?.find(
        (a: any) => Object.keys(a)[0] === answerKey
      );
      return ansObj ? Object.values(ansObj)[0] : null; // dạng "A,B" hoặc "A"
    });

    // Convert về dạng index để so sánh với đúng
    const parsedAnswers = answers.map((a) => {
      if (!a) return null;

      // Nếu checkbox -> "A,B" => ["A","B"] => [0,1]
      if (typeof a === "string" && a.includes(",")) {
        return a.split(",").map((letter) => letter.charCodeAt(0) - 65);
      }

      // Radio -> "A" => 0
      if (typeof a === "string") {
        return a.charCodeAt(0) - 65;
      }
      if (q.type === "text" || q.type === "paragraph") {
        return a;
      }

      return null;
    });

    // Đếm từng lựa chọn
    const counts = q.options.map(
      (_opt, i) =>
        parsedAnswers.filter((ans) =>
          Array.isArray(ans) ? ans.includes(i) : ans === i
        ).length
    );

    const total = submissions.length || 1;

    // Tính số người đúng
    const correctIndex = q.correctAnswer;

    let correctCount = 0;

    parsedAnswers.forEach((ans) => {
      if (ans == null) return;

      if (Array.isArray(ans) && Array.isArray(q.correctAnswer)) {
        // checkbox
        if (
          ans.length === q.correctAnswer.length &&
          ans.every((x) => q.correctAnswer?.includes(x))
        ) {
          correctCount++;
        }
      } else if (
        typeof ans === "string" &&
        typeof q.correctAnswer === "string"
      ) {
        // text
        if (ans.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
          correctCount++;
        }
      } else {
        // radio
        if (ans === q.correctAnswer) correctCount++;
      }
    });

    const correctRate = ((correctCount / total) * 100).toFixed(0);

    const options = q.options.map((opt, i) => ({
      label: opt,
      count: counts[i],
      isCorrect: Array.isArray(correctIndex)
        ? correctIndex.includes(i)
        : i === correctIndex,
    }));

    const chartData = options.map((o) => ({
      name: o.label,
      value: (o.count / total) * 100,
    }));

    return {
      text: q.questionText,
      score: q.score,
      correctRate,
      options,
      chartData,
      type: q.type,
      rawAnswers: answers, // lưu câu trả lời thô để hiển thị text
    };
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Kết quả biểu mẫu
      </h1>
      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600 text-sm mb-1">Số lượt nộp</p>
          <p className="text-3xl font-bold ">{submissions.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600 text-sm mb-1">Điểm trung bình</p>
          <p className="text-3xl font-bold ">{avgScore}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600 text-sm mb-1">Điểm cao nhất</p>
          <p className="text-3xl font-bold ">{maxScore}</p>
        </div>
      </div>
      {/* --- BIỂU ĐỒ THEO CÂU HỎI --- */}
      <div className=" gap-y-6 mb-8 flex flex-col items-center  ">
        {questionStats?.map((question, i) => (
          <div key={i} className="p-6 rounded-2xl shadow-sm bg-white w-4/5">
            <h2 className="text-lg font-medium mb-1">
              {i + 1}. {question.text}{" "}
              <span className="text-gray-500">({question.score} điểm)</span>
            </h2>

            {/* Nếu là câu hỏi text → không có tỷ lệ đúng */}
            {question.type !== "text" && (
              <p className="text-sm text-blue-600 mb-4">
                {question.correctRate}% số người được hỏi trả lời đúng câu hỏi
                này.
              </p>
            )}

            {/* --- Nếu là câu hỏi dạng text → hiển thị danh sách --- */}
            {question.type === "text" || question.type === "paragraph" ? (
              <QuestionResult questionStat={question} COLORS={COLORS} />
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  {question.options.map((opt, j) => (
                    <div
                      key={j}
                      className="grid grid-cols-[20px_1fr_20px_1px] items-center gap-2 mb-2">
                      <div
                        className="w-5 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[j % COLORS.length] }}
                      />
                      <span className="truncate">{opt.label}</span>

                      <span className="text-gray-600">{opt.count}</span>
                      {opt.isCorrect && (
                        <Check className="w-4 h-4 text-green-500 ml-1" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="relative">
                  <PieChart width={200} height={200}>
                    <Pie
                      data={question.chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={1}
                      dataKey="value"
                      label={renderCustomLabel}
                      labelLine={false}>
                      {question.chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

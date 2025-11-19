import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "../../../stores/useForm";
import { useAuth } from "../../../stores/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../services/firebaseConfig";
import { CheckCircle, XCircle } from "lucide-react";

export default function AnswerPage() {
  const { user, initAuth } = useAuth();
  const labels = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const { formId } = useParams({ from: "/exam/response/$formId" });
  const { getForm, title, questions } = useForm();

  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initAuth();
    getForm(formId);

    const fetchSubmission = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, "forms", formId, "submissions", user.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setSubmission(docSnap.data());
        else setSubmission(null);
      } catch (err) {
        console.log("Không lấy được submission:", err);
        setSubmission(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, [formId, user?.id]);

  if (loading || !title.titleText || questions.length === 0)
    return (
      <div className="p-6 text-center text-gray-500">Đang tải form...</div>
    );

  if (!submission)
    return (
      <div className="p-6 text-center text-red-500">
        Không tìm thấy bài làm của bạn
      </div>
    );

  const getSubmissionValue = (qIndex: number) => {
    const submissionAnswers = submission.answers || [];
    const submitted = submissionAnswers.find(
      (a: Record<string, any>) => Object.keys(a)[0] === `Câu ${qIndex + 1}`
    );
    return submitted ? Object.values(submitted)[0] : null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h1 className="text-4xl font-bold mb-2">{title.titleText}</h1>
          <p className="text-gray-600 mb-8">{title.description}</p>

          <div className="flex justify-center gap-4 mb-6">
            <div>
              <p className="text-gray-600 text-sm">Điểm số</p>
              <p className="text-3xl font-bold">
                {submission.totalScore}/{questions.length}
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-500 border-t pt-3">
            <span className="font-semibold">Nộp bài lúc:</span>{" "}
            {new Date(submission.submitAt).toLocaleString("vi-VN")}
          </p>
        </div>

        {/* Câu hỏi chi tiết */}
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const submittedVal = getSubmissionValue(idx);
            const userAnswerStr = submittedVal ?? "Chưa trả lời";

            const userIndices =
              q.type !== "text" && typeof userAnswerStr === "string"
                ? userAnswerStr
                    .split(",")
                    .map((s) => labels.indexOf(s.trim()))
                    .filter((i) => i >= 0)
                : [];

            const correctIndices = Array.isArray(q.correctAnswer)
              ? q.correctAnswer
              : [q.correctAnswer];

            let isCorrect = false;
            if (q.type === "checkbox") {
              const correctLabels = (q.correctAnswer as number[])
                ?.map((i) => labels[i])
                .sort()
                .join(",");
              isCorrect = userAnswerStr === correctLabels;
            } else if (q.type === "radio") {
              const correctLabel = labels[q.correctAnswer as number];
              isCorrect = userAnswerStr === correctLabel;
            } else if (q.type === "text") {
              isCorrect =
                typeof q.correctAnswer === "string" &&
                q.correctAnswer.trim().toLowerCase() ===
                  String(userAnswerStr).trim().toLowerCase();
            }

            return (
              <div key={q.id} className="bg-white rounded-xl shadow-md p-5">
                <div
                  className={`flex items-center gap-2 mb-3 w-fit px-3 py-1 rounded-full font-semibold ${
                    isCorrect
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                  {isCorrect ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Đúng
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      Không chính xác{" "}
                    </>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-3 flex gap-x-1">
                  <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-bold ">
                    Câu {idx + 1}
                  </span>
                  {q.questionText}
                </h3>

                <div className="space-y-2 ml-2">
                  {/* Text answer */}
                  {q.type === "text" ? (
                    <div className="flex flex-col  gap-3">
                      <input
                        type="text"
                        value={userAnswerStr}
                        disabled
                        className={`p-2 border rounded-lg w-1/4 ${
                          isCorrect
                            ? "border-green-400 bg-green-50"
                            : "border-red-400 bg-red-50"
                        }`}
                      />
                      <span
                        className={`font-bold  flex ${
                          isCorrect ? "text-green-600" : "text-red-600"
                        }`}></span>
                      {!isCorrect && q.correctAnswer && (
                        <span className=" text-sm flex items-center">
                          Đáp án đúng:
                          <div className="text-black h-10 w-10 border rounded-md border-gray-400 items-center flex justify-center">
                            {q.correctAnswer}{" "}
                          </div>
                        </span>
                      )}
                    </div>
                  ) : (
                    q.options.map((opt: string, i: number) => {
                      const userChoice = userIndices.includes(i);
                      const correctChoice = correctIndices.includes(i);

                      let border = "border-gray-300";
                      if (correctChoice && userChoice)
                        border = "border-green-500 bg-green-50";
                      else if (correctChoice)
                        border = "border-green-300 bg-green-50";
                      else if (userChoice) border = "border-red-400 bg-red-50";

                      return (
                        <div
                          key={i}
                          className={`flex items-center justify-between p-2 border rounded-lg ${border} w-1/3`}>
                          <div className="flex items-center gap-3">
                            <input
                              type={q.type}
                              checked={userChoice}
                              readOnly
                              className="w-5 h-5 accent-[#bdbdbe]-black"
                            />
                            <span className="font-bold text-gray-700">
                              {labels[i]}.
                            </span>
                            <span className="text-gray-800">{opt}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Nút quay lại */}
        <div className="flex gap-4 mt-8 mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition">
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}

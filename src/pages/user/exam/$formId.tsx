import { useParams } from "@tanstack/react-router";
import { useForm } from "../../../stores/userForm";
import { use, useEffect, useState } from "react";
import { auth } from "../../../services/firebaseConfig";
import { useAuth } from "../../../stores/useAuth";

export default function ExamPage() {
  const { user, initAuth } = useAuth();
  const labels = ["A", "B", "C", "D"];
  const { formId } = useParams({ from: "/user/exam/$formId" });
  const { getForm, title, questions, submitForm } = useForm();
  const [answers, setAnswers] = useState<
    Record<string, number | number[] | string | null>
  >({});
  useEffect(() => {
    getForm(formId);
  }, [formId]);
  useEffect(() => {
    const fetchUser = () => {
      initAuth();
    };
    fetchUser();
  }, []);
  if (!title.titleText && questions.length === 0)
    return (
      <div className="p-6 text-center text-gray-500">Đang tải form...</div>
    );
  return (
    <div className="min-h-full bg-gradient p-6 shadow-2xl rounded-2xl">
      <h1 className="text-3xl font-bold mb-2">{title?.titleText}</h1>
      <p className="text-gray-600 mb-6">{title?.description}</p>

      {/* Câu hỏi */}
      {questions.map((question, index) => (
        <div
          key={question.id}
          className="bg-white rounded-xl shadow-sm p-5 mb-4">
          <h3 className="font-semibold text-lg mb-3 flex gap-x-1">
            <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-bold ">
              Câu {index + 1}
            </span>
            {question.questionText}
          </h3>

          <div className="space-y-2">
            {(question.type === "radio" || question.type === "checkbox") &&
              question.options.map((option, optIndex) => (
                <label
                  key={optIndex}
                  className="flex items-center gap-2 p-2 rounded-lg cursor-pointer ">
                  <div className="relative">
                    {question.type === "checkbox" && (
                      <input
                        type={question.type}
                        checked={
                          (answers[question.id] as number[])?.includes(
                            optIndex
                          ) ?? false
                        }
                        onChange={(e) => {
                          const prev = (answers[question.id] as number[]) || [];

                          const updated = e.target.checked
                            ? [...prev, optIndex]
                            : prev.filter((i) => i !== optIndex);

                          setAnswers((prev) => ({
                            ...prev,
                            [question.id]: updated,
                          }));
                        }}
                        className="w-5 h-5 cursor-pointer"
                      />
                    )}
                    {question.type === "radio" && (
                      <input
                        type="radio"
                        name={question.id}
                        checked={answers[question.id] === optIndex}
                        onChange={() =>
                          setAnswers((prev) => ({
                            ...prev,
                            [question.id]: optIndex,
                          }))
                        }
                      />
                    )}
                  </div>

                  <span className="font-bold text-gray-700">
                    {labels[optIndex]}.
                  </span>
                  <span className="text-gray-800">{option}</span>
                </label>
              ))}
            {question.type === "text" && (
              <input
                type="text"
                name={question.id}
                value={(answers[question.id] as string) || ""}
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    [question.id]: e.target.value,
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            )}
          </div>
        </div>
      ))}

      {/* Nút nộp bài */}
      <button
        onClick={() => {
          if (!user?.id) {
            alert("Vui lòng đăng nhập trước khi gửi biểu mẫu!");
            return;
          }
          submitForm(formId, user.id, answers);
        }}
        className="mt-6 w-full bg-black text-white py-3 rounded-xl font-semibold hover:scale-[1.01] transition cursor-pointer">
        Nộp bài
      </button>
    </div>
  );
}

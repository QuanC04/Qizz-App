import { useNavigate, useParams } from "@tanstack/react-router";
import { useForm } from "../../../stores/useForm";
import { use, useEffect, useState } from "react";
import { useAuth } from "../../../stores/useAuth";

export default function ExamPage() {
  const navigate = useNavigate();
  const { user, initAuth } = useAuth();
  const labels = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const { formId } = useParams({ from: "/exam/$formId" });
  const { getForm, title, questions, submitForm, requireLogin } = useForm();
  const [answers, setAnswers] = useState<
    Record<string, number | number[] | string | null>[]
  >([]);
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
  if (requireLogin && !user) {
    return <div>Vui lòng đăng nhập trước khi làm bài</div>;
  }
  return (
    <div className="min-h-full bg-gradient p-6 shadow-2xl rounded-2xl">
      <h1 className="text-3xl font-bold mb-2">{title?.titleText}</h1>
      <p className="text-gray-600 mb-6">{title?.description}</p>

      {/* Câu hỏi */}
      {questions.map((question, index) => {
        const answerObject = answers.find(
          (a) => Object.keys(a)[0] === question.id
        );
        const userAnswer = answerObject ? Object.values(answerObject)[0] : null;
        return (
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
                            (userAnswer as number[])?.includes(optIndex) ??
                            false
                          }
                          onChange={(e) => {
                            setAnswers((prev) => {
                              const newAnswers = [...prev];
                              const index = newAnswers.findIndex(
                                (a) => Object.keys(a)[0] === question.id
                              );

                              const current =
                                index !== -1
                                  ? (Object.values(
                                      newAnswers[index]
                                    )[0] as number[])
                                  : [];

                              const updated = e.target.checked
                                ? [...current, optIndex]
                                : current.filter((i) => i !== optIndex);

                              if (index !== -1)
                                newAnswers[index] = { [question.id]: updated };
                              else newAnswers.push({ [question.id]: updated });

                              return newAnswers;
                            });
                          }}
                          className="w-5 h-5 cursor-pointer"
                        />
                      )}
                      {question.type === "radio" && (
                        <input
                          type="radio"
                          name={question.id}
                          checked={userAnswer === optIndex}
                          onChange={() => {
                            setAnswers((prev) => {
                              const newAnswers = [...prev];
                              const index = newAnswers.findIndex(
                                (a) => Object.keys(a)[0] === question.id
                              );

                              if (index !== -1)
                                newAnswers[index] = { [question.id]: optIndex };
                              else newAnswers.push({ [question.id]: optIndex });

                              return newAnswers;
                            });
                          }}
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
                  value={(userAnswer as string) || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setAnswers((prev) => {
                      const newAnswers = [...prev];
                      const index = newAnswers.findIndex(
                        (a) => Object.keys(a)[0] === question.id
                      );

                      if (index !== -1)
                        newAnswers[index] = { [question.id]: value };
                      else newAnswers.push({ [question.id]: value });

                      return newAnswers;
                    });
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              )}
            </div>
          </div>
        );
      })}

      {/* Nút nộp bài */}
      <button
        onClick={() => {
          if (!user?.id) {
            alert("Vui lòng đăng nhập trước khi gửi biểu mẫu!");
            return;
          }
          submitForm(formId, user.id, answers, navigate);
        }}
        className="mt-6 w-full bg-black text-white py-3 rounded-xl font-semibold hover:scale-[1.01] transition cursor-pointer">
        Nộp bài
      </button>
    </div>
  );
}

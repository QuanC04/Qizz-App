import { useNavigate, useParams } from "@tanstack/react-router";
import { useForm } from "../../../stores/useForm";
import { useEffect, useState } from "react";
import { useAuth } from "../../../stores/useAuth";
import { Clock } from "lucide-react";
import TimerProgress from "@/components/timerProgress";

export default function ExamPage() {
  const navigate = useNavigate();
  const { user, initAuth } = useAuth();
  const labels = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const { formId } = useParams({ from: "/exam/$formId" });
  const {
    getForm,
    title,
    questions,
    submitForm,
    requireLogin,
    enableTimer,
    timerMinutes,
  } = useForm();
  const [answers, setAnswers] = useState<
    Record<string, number | number[] | string | null>[]
  >([]);
  const [started, setStarted] = useState(false);
  const [submissionDone, setSubmissionDone] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
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
  if (!started && enableTimer) {
    return (
      <div className="min-h-screen bg-white p-6 md:p-12 flex flex-col  items-center ">
        <div className="max-w-2xl">
          {/* Timer */}
          <div className="flex items-center gap-2 text-gray-800 mb-8 justify-self-center">
            <Clock className="w-5 h-5" />
            <span className="text-lg font-medium ">{timerMinutes} phút</span>
          </div>

          {/* Main content */}
          <div>
            <p className="text-gray-800 font-medium mb-6 text-base">
              Đây là biểu mẫu đã hẹn giờ.
            </p>

            <p className="text-gray-700 leading-relaxed mb-8 text-base">
              Sau khi bắt đầu, bạn không thể tạm dừng bộ hẹn giờ. Đừng lo, Forms
              cung cấp cho bạn lời nhắc phút cuối trước khi gửi. Câu trả lời của
              bạn sẽ được gửi tự động khi hết thời gian. Vui lòng chuẩn bị trước
              khi bạn bắt đầu giúp quản lý thời gian gửi của bạn.
            </p>

            {/* Button */}
            <button
              onClick={() => {
                setStarted(true);
                setStartTime(Date.now());
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors border-2 border-blue-600 cursor-pointer">
              Bắt đầu làm bài
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className=" bg-gradient p-6  rounded-2xl w-8/10 justify-self-center">
      {enableTimer ? (
        <div className=" bg-white p-6 shadow-2xl rounded-2xl  z-50  sticky top-0 h-10 ">
          <TimerProgress
            timerMinutes={timerMinutes}
            formId={formId}
            submissionDone={submissionDone}
            onTimeUp={async () => {
              const timeSpent = startTime
                ? Math.floor((Date.now() - startTime) / 1000)
                : 0;
              await submitForm(formId, user?.id as string, answers, timeSpent);
              setSubmissionDone(true);
              navigate({ to: `/exam/response/${formId}` });
            }}
            onStartTimer={() => {
              if (!startTime) setStartTime(Date.now());
            }}
          />
        </div>
      ) : null}
      <div className=" bg-gradient p-6 shadow-2xl rounded-2xl ">
        <h1 className="text-3xl font-bold mb-2">{title?.titleText}</h1>
        <p className="text-gray-600 mb-6">{title?.description}</p>

        {/* Câu hỏi */}
        {questions.map((question, index) => {
          const answerObject = answers.find(
            (a) => Object.keys(a)[0] === question.id
          );
          const userAnswer = answerObject
            ? Object.values(answerObject)[0]
            : null;
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
                                  newAnswers[index] = {
                                    [question.id]: updated,
                                  };
                                else
                                  newAnswers.push({ [question.id]: updated });

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
                                  newAnswers[index] = {
                                    [question.id]: optIndex,
                                  };
                                else
                                  newAnswers.push({ [question.id]: optIndex });

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
          onClick={async () => {
            if (!user?.id) {
              alert("Vui lòng đăng nhập trước khi gửi biểu mẫu!");
              return;
            }

            const timeSpent = startTime
              ? Math.floor((Date.now() - startTime) / 1000)
              : 0;
            await submitForm(formId, user.id, answers, timeSpent);
            setSubmissionDone(true);
            navigate({ to: `/exam/response/${formId}` });
          }}
          className="mt-6 w-full bg-black text-white py-3 rounded-xl font-semibold hover:scale-[1.01] transition cursor-pointer">
          Nộp bài
        </button>
      </div>
    </div>
  );
}

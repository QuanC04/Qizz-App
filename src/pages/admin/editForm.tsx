import { useEffect, useState } from "react";
import { useForm } from "../../stores/userForm";
import { Link, useParams } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { nanoid } from "nanoid";

export default function EditForm() {
  const [showAddQuestion, setShowAddQuestion] = useState(true);
  const [showType, setShowType] = useState(false);
  const { formId } = useParams({ from: "/form/edit/$formId" });
  const {
    title,
    questions,
    getForm,
    setTitle,
    deleteQuestion,
    updateQuestion,
    addQuestion,
    saveForm,
    updateForm,
  } = useForm();

  useEffect(() => {
    getForm(formId);
  }, [formId]);
  if (!title.titleText && questions.length === 0)
    return (
      <div className="p-6 text-center text-gray-500">Đang tải form...</div>
    );
  return (
    <div className="min-h-full bg-gradient p-6 shadow-2xl rounded-2xl">
      <div className=" mx-auto">
        {/* --- Header Form --- */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Tạo Form/Quiz Mới
          </h1>

          {/* Tiêu đề Form */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tiêu đề Form <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title.titleText}
              onChange={(e) => setTitle(e.target.value, title.description)}
              placeholder="Nhập tiêu đề form..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-lg"
            />
          </div>

          {/* Mô tả Form */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              value={title.description}
              onChange={(e) => setTitle(title.titleText, e.target.value)}
              placeholder="Nhập mô tả cho form..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors resize-none "
            />
          </div>
          {/* --- Danh sách câu hỏi --- */}
          <div>
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4 mb-4">
                {/* Header câu hỏi */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-bold">
                      Câu {index + 1}
                    </span>
                    <button
                      onClick={() => deleteQuestion(question.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Nội dung câu hỏi */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nội dung câu hỏi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={question.questionText}
                    onChange={(e) =>
                      updateQuestion(question.id, {
                        questionText: e.target.value,
                      })
                    }
                    placeholder="Nhập câu hỏi..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                  />
                </div>

                {/* Các lựa chọn trả lời */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Các lựa chọn trả lời <span className="text-red-500">*</span>
                  </label>

                  <div className="flex flex-col gap-2">
                    {question.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="relative">
                          {question.type === "checkbox" && (
                            <input
                              type={question.type}
                              checked={(
                                question.correctAnswer as number[]
                              )?.includes(index)}
                              onChange={(e) => {
                                let answers =
                                  question.correctAnswer as number[];

                                const updatedAnswers = e.target.checked
                                  ? [...answers, index]
                                  : answers.filter((i) => i !== index);
                                updateQuestion(question.id, {
                                  correctAnswer: updatedAnswers,
                                });
                              }}
                              className="w-5 h-5 cursor-pointer"
                            />
                          )}
                          {question.type === "radio" && (
                            <input
                              type={question.type}
                              checked={question.correctAnswer === index}
                              onChange={() =>
                                updateQuestion(question.id, {
                                  correctAnswer: index,
                                })
                              }
                              className="w-5 h-5 cursor-pointer"
                            />
                          )}
                        </div>

                        {/* Nội dung option*/}

                        {question.type === "text" ? (
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...question.options];
                              newOptions[index] = e.target.value;
                              updateQuestion(question.id, {
                                options: newOptions,
                                correctAnswer: e.target.value,
                              });
                            }}
                            placeholder="Nhập đáp án"
                            className="flex px-3 py-2 border rounded-lg w-1/2"
                          />
                        ) : (
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...question.options];
                              newOptions[index] = e.target.value;
                              updateQuestion(question.id, {
                                options: newOptions,
                              });
                            }}
                            placeholder={`Lựa chọn ${index}`}
                            className="flex px-3 py-2 border rounded-lg w-1/3"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Thêm câu hỏi */}
          <div>
            {showAddQuestion && (
              <button
                onClick={() => {
                  setShowAddQuestion((prev) => !prev);
                  setShowType((prev) => !prev);
                }}
                className="mt-6 w-full bg-white border-2 border-dashed  hover:border-purple-600 hover:text-purple-600 font-semibold py-4 rounded-xl  flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] transition-all">
                + Thêm câu hỏi
              </button>
            )}
            {showType && (
              <div>
                <h2 className="text-sm font-semibold text-gray-600 mb-2">
                  Chọn loại câu hỏi:
                </h2>
                <div className="grid grid-cols-3 gap-2 ">
                  <button
                    className="flex flex-col items-center justify-center border rounded-lg p-3 hover:scale-[1.02]  transition-all cursor-pointer"
                    onClick={() => {
                      setShowAddQuestion((prev) => !prev);
                      setShowType((prev) => !prev);
                      addQuestion({
                        type: "radio",
                        id: nanoid(),
                        questionText: "",
                        options: ["", "", "", ""],
                        correctAnswer: null,
                        score: 1,
                      });
                    }}>
                    Lựa chọn
                  </button>
                  <button
                    className="flex flex-col items-center justify-center border rounded-lg p-3 hover:scale-[1.02]  transition-all cursor-pointer"
                    onClick={() => {
                      setShowAddQuestion((prev) => !prev);
                      setShowType((prev) => !prev);
                      addQuestion({
                        type: "checkbox",
                        id: nanoid(),
                        questionText: "",
                        options: ["", "", "", ""],
                        correctAnswer: [],
                        score: 1,
                      });
                    }}>
                    Nhiều lựa chọn
                  </button>
                  <button
                    className="flex flex-col items-center justify-center border rounded-lg p-3 hover:scale-[1.02]  transition-all cursor-pointer"
                    onClick={() => {
                      setShowAddQuestion((prev) => !prev);
                      setShowType((prev) => !prev);
                      addQuestion({
                        type: "text",
                        id: nanoid(),
                        questionText: "",
                        options: [""],
                        correctAnswer: "",
                        score: 1,
                      });
                    }}>
                    Văn bản
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Lưu Form */}
          <Link to="/form">
            <button
              className="mt-6 w-full bg-black    text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl  hover:scale-[1.02] transition-all 0 flex items-center justify-center gap-2 cursor-pointer"
              onClick={() => {
                saveForm(), updateForm();
              }}>
              <Plus size={20} />
              Lưu Form
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

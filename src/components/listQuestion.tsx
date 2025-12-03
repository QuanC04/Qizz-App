import { useForm, type Question } from "@/stores/useForm";
import { Trash2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableQuestion from "@/utils/sortQuestion";

export default function ListQuestion({
  questions,
  deleteQuestion,
  updateQuestion,
}: any) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 50 },
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = questions.findIndex((q: Question) => q.id === active.id);
    const newIndex = questions.findIndex((q: Question) => q.id === over.id);

    const reordered: Question[] = arrayMove(questions, oldIndex, newIndex);
    useForm.setState({ questions: reordered });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}>
      <SortableContext
        items={questions.map((q: Question) => q.id)}
        strategy={verticalListSortingStrategy}>
        {questions.map((question: Question, index: number) => (
          <SortableQuestion key={question.id} id={question.id}>
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4 mb-4">
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
                            type="checkbox"
                            checked={(
                              question.correctAnswer as number[]
                            )?.includes(index)}
                            onChange={(e) => {
                              let answers = question.correctAnswer as number[];

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
                        <div className="relative">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...question.options];
                              newOptions[index] = e.target.value;
                              updateQuestion(question.id, {
                                options: newOptions,
                                correctAnswer: newOptions,
                              });
                            }}
                            placeholder="Nhập đáp án"
                            className="flex px-3 py-2 border rounded-lg w-full"
                          />
                          <button className="absolute top-2 right-2 opacity-50 cursor-pointer">
                            Thêm
                          </button>
                        </div>
                      ) : (
                        <div className="relative w-1/3 group">
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
                            className="flex px-3 py-2 border rounded-lg w-9/10"
                          />
                          <button
                            onClick={() => {
                              const newOptions = question.options.filter(
                                (_, i) => i !== index
                              );
                              updateQuestion(question.id, {
                                options: newOptions,
                              });
                            }}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-70 group-focus-within:opacity-70 transition-opacity cursor-pointer">
                            <Trash2 />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {(question.type === "radio" ||
                    question.type === "checkbox") && (
                    <button
                      onClick={() => {
                        const newOptions = [...question.options, ""];
                        updateQuestion(question.id, { options: newOptions });
                      }}
                      className="mt-2 cursor-pointer font-semibold hover:underline text-sm w-fit">
                      + Thêm lựa chọn
                    </button>
                  )}
                </div>
              </div>
            </div>
          </SortableQuestion>
        ))}
      </SortableContext>
    </DndContext>
  );
}

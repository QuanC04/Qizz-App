import { useEffect, useState } from "react";
import { useForm } from "../../stores/useForm";
import { Link, useParams } from "@tanstack/react-router";
import { Plus, Send } from "lucide-react";
import { nanoid } from "nanoid";
import ShareExamLinkDialog from "../../components/dialogShareLink";
import { useAuth } from "../../stores/useAuth";
import ListQuestion from "@/components/listQuestion";
import { exportQuestions, importQuestions } from "@/utils/excel";
import AddQuestion from "@/components/addQuestion";

export default function EditForm() {
  const { user } = useAuth();
  const [showAddQuestion, setShowAddQuestion] = useState(true);
  const [showType, setShowType] = useState(false);
  const { formId } = useParams({ from: "/form/edit/$formId" });
  const {
    title,
    questions,
    saving,
    getForm,
    setTitle,
    deleteQuestion,
    updateQuestion,
    addQuestion,
    saveForm,
    updateForm,
  } = useForm();
  useEffect(() => {
    useForm.setState({
      createdBy: user?.email || user?.id || "unknown",
    });
    const timer = setTimeout(() => {
      saveForm();
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, questions]);
  useEffect(() => {
    useForm.setState({
      createdBy: user?.email || user?.id || "unknown",
    });
  }, [user]);

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
        <div className="text-sm text-gray-500 h-5">
          {saving ? (
            <span className="text-yellow-600">Đang lưu...</span>
          ) : (
            <span className="text-green-600">Đã lưu ✓</span>
          )}
        </div>
        {/* --- Header Form --- */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
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
          <ListQuestion
            questions={questions}
            deleteQuestion={deleteQuestion}
            updateQuestion={updateQuestion}
          />
          {/* Thêm câu hỏi */}
          <AddQuestion
            showAddQuestion={showAddQuestion}
            setShowAddQuestion={setShowAddQuestion}
            addQuestion={addQuestion}
            setShowType={setShowType}
            showType={showType}
            nanoid={nanoid}
          />
          {/* --- Import câu hỏi từ Excel --- */}
          <div className="mb-4">
            <label className="font-semibold text-gray-700 block mb-2">
              Import câu hỏi từ Excel:
            </label>

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const imported = await importQuestions(file);

                imported.forEach((q) => addQuestion(q)); // thêm vào form
              }}
              className="w-full cursor-pointer border p-3 rounded-lg bg-white shadow"
            />
            <button
              className="w-full cursor-pointer border p-3 rounded-lg bg-white shadow"
              onClick={() => exportQuestions(questions)}>
              Export câu hỏi:
            </button>
          </div>
          {/* Lưu Form */}
          <Link to="/form">
            <button
              className="mt-6 w-full bg-black    text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl  hover:scale-[1.02] transition-all 0 flex items-center justify-center gap-2 cursor-pointer"
              onClick={async () => {
                await saveForm(), updateForm();
              }}>
              <Plus size={20} />
              Lưu Form
            </button>
          </Link>
          {/* share */}
          <div className="flex gap-x-2">
            <div className="w-1/2">
              <ShareExamLinkDialog formId={formId} />
            </div>
            <Link to={`/form/${formId}`} className="w-1/2">
              <button className="mt-6 w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer">
                <Send size={20} />
                Xem phản hồi
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

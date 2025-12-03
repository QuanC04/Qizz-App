export default function AddQuestion({
  showAddQuestion,
  setShowAddQuestion,
  addQuestion,
  setShowType,
  nanoid,
  showType,
}: any) {
  return (
    <div>
      {showAddQuestion && (
        <button
          onClick={() => {
            setShowAddQuestion((prev: any) => !prev);
            setShowType((prev: any) => !prev);
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
                setShowAddQuestion((prev: boolean) => !prev);
                setShowType((prev: boolean) => !prev);
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
                setShowAddQuestion((prev: boolean) => !prev);
                setShowType((prev: boolean) => !prev);
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
                setShowAddQuestion((prev: boolean) => !prev);
                setShowType((prev: boolean) => !prev);
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
  );
}

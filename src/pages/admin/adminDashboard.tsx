import { useEffect, useState } from "react";
import { useForm } from "../../stores/userForm";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../../stores/useAuth";

export default function AdminDashboard() {
  const toggleMenu = (formId: string) => {
    setOpenMenuId(openMenuId === formId ? null : formId);
  };
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const { getAllForm, deleteForm } = useForm();
  const [forms, setForms] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllForm();
      setForms(data);
    };
    fetchData();
  }, []);

  if (user?.role !== "admin") return "/403";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 m-5">Danh sách Form</h1>
      <ul className="grid-cols-3 grid">
        {forms.map((form) => (
          <li
            key={form.formId}
            className="m-5 shadow-xl h-[30vh] flex flex-col items-start p-2 rounded-2xl  relative ">
            <h2 className="text-2xl pt-3 pr-5 ">{form.title?.titleText}</h2>

            <button
              onClick={() => toggleMenu(form.formId)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors absolute top-2 right-0 cursor-pointer">
              <MoreVertical size={20} className="text-gray-600" />
            </button>

            {/* Dropdown Menu */}
            {openMenuId === form.formId && (
              <div className="absolute right-0 top-5 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10 ">
                <Link to={`/admin/form/${form.formId}`}>
                  <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700  rounded-t-lg cursor-pointer">
                    <Edit size={18} className="text-blue-600" />
                    <span className="font-medium">Chỉnh sửa</span>
                  </button>
                </Link>
                <button
                  onClick={async () => {
                    const updated = await deleteForm(form.formId);
                    setForms(updated);
                    setOpenMenuId(null);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors border-t border-gray-100 rounded-b-lg cursor-pointer">
                  <Trash2 size={18} />
                  <span className="font-medium">Xóa</span>
                </button>
              </div>
            )}

            <span className="font-medium line-clamp-2">
              {form.title?.description}
            </span>
            <span>{form.questions?.length || 0} câu hỏi</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { useForm } from "../../stores/useForm";
import {
  Edit,
  Globe,
  Lock,
  MessageSquareReply,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../../stores/useAuth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";

export default function AdminDashboard() {
  const toggleMenu = (formId: string) => {
    setOpenMenuId(openMenuId === formId ? null : formId);
  };
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"public" | "draft">("public");
  const { getAllForm, deleteForm } = useForm();
  const [forms, setForms] = useState<any[]>([]);
  const { user } = useAuth();
  const filteredForms = forms.filter((form) => form.status === activeTab);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const data = await getAllForm();
      const myForms = data.filter(
        (form: any) => form.createdBy === user?.email || user?.id
      );

      setForms(myForms);
    };
    fetchData();
  }, [user]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 m-5">Danh sách Form</h1>
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("public")}
          className={`px-4 py-2 rounded-lg font-semibold cursor-pointer ${
            activeTab === "public"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-700"
          }`}>
          Công khai
        </button>
        <button
          onClick={() => setActiveTab("draft")}
          className={`px-4 py-2 rounded-lg font-semibold cursor-pointer ${
            activeTab === "draft"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-700"
          }`}>
          Bản nháp
        </button>
      </div>
      <ul className="  sm:grid sm:grid-cols-3 grid grid-cols-2">
        {filteredForms.map((form) => (
          <li
            key={form.formId}
            className="m-5 shadow-xl sm:h-[30vh] h-[20vh] flex flex-col items-start p-2 rounded-2xl  relative ">
            <h2 className="text-2xl pt-3 pr-5 ">{form.title?.titleText}</h2>

            <button
              onClick={() => toggleMenu(form.formId)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors absolute top-2 right-0 cursor-pointer">
              <MoreVertical size={20} className="text-gray-600" />
            </button>

            {/* Dropdown Menu */}
            {openMenuId === form.formId && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-5 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10 ">
                {form.status === "draft" ? (
                  <button
                    onClick={async () => {
                      await updateDoc(doc(db, "forms", form.formId), {
                        status: "public",
                      });
                      setForms((prev) =>
                        prev.map((f) =>
                          f.formId === form.formId
                            ? { ...f, status: "public" }
                            : f
                        )
                      );
                      setOpenMenuId(null);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700  rounded-t-lg cursor-pointer">
                    {" "}
                    <Globe size={18} className="text-blue-600" />
                    <span>Công Khai</span>
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      await updateDoc(doc(db, "forms", form.formId), {
                        status: "draft",
                      });
                      setForms((prev) =>
                        prev.map((f) =>
                          f.formId === form.formId
                            ? { ...f, status: "draft" }
                            : f
                        )
                      );
                      setOpenMenuId(null);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700  rounded-t-lg cursor-pointer">
                    <Lock size={18} className="text-blue-600" />
                    <span>Bản Nháp</span>
                  </button>
                )}
                <Link to={`/admin/edit/${form.formId}`}>
                  <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 cursor-pointer border-t border-gray-100">
                    <Edit size={18} className="text-blue-600" />
                    <span className="font-medium">Chỉnh sửa</span>
                  </button>
                </Link>
                <Link to={`/admin/form/${form.formId}`}>
                  <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 cursor-pointer border-t border-gray-100">
                    <MessageSquareReply size={18} className="text-blue-600" />
                    <span className="font-medium">Xem lượt nộp</span>
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

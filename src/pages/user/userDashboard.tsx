import { useEffect, useState } from "react";
import { useForm } from "../../stores/userForm";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../../stores/useAuth";

export default function UserDashboard() {
  const { user } = useAuth();
  const { getAllForm } = useForm();
  const [forms, setForms] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllForm();
      setForms(data);
    };
    fetchData();
  }, []);
  const filterForms = forms.filter((form) => form.status === "public");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 m-5">Danh sách Form</h1>
      <ul className="grid-cols-3 grid">
        {filterForms.map((form) => (
          <Link to={`/exam/${form.formId}`}>
            <li
              key={form.formId}
              className="m-5 shadow-xl h-[30vh] flex flex-col items-start p-2 rounded-2xl  relative ">
              <h2 className="text-2xl pt-3 pr-5 ">{form.title?.titleText}</h2>

              <span className="font-medium line-clamp-2">
                {form.title?.description}
              </span>
              <span>{form.questions?.length || 0} câu hỏi</span>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

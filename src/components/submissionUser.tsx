import { useEffect, useState } from "react";
import { formatTime } from "@/utils/formatTime";

export function SubmissionRow({
  sub,
  i,
  openIndex,
  setOpenIndex,
  getUser,
}: any) {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser(sub.userId);
      setUserData(user);
    };
    fetchUser();
  }, [sub.userId]);

  return (
    <>
      <tr key={sub.id} className="border-t hover:bg-gray-50 transition-colors">
        <td className="p-3 text-center">{i + 1}</td>
        <td className="p-3 truncate max-w-[200px]" title={userData?.email}>
          {userData?.email ?? "Đang tải..."}
        </td>
        <td className="p-3 text-center font-semibold text-gray-700">
          {sub.totalScore ?? 0}
        </td>
        <td className="p-3 text-gray-600 whitespace-nowrap">{sub.submitAt}</td>
        <td className="p-3 text-center text-gray-600">
          {sub.timeSpent ? formatTime(sub.timeSpent) : "--"}
        </td>
        <td className="p-3 text-center">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="text-blue-600 hover:underline text-sm cursor-pointer">
            {openIndex === i ? "Ẩn" : "Xem"}
          </button>
        </td>
      </tr>

      {openIndex === i && (
        <tr className="bg-gray-50 border-t">
          <td colSpan={6} className="p-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-inner">
              <h3 className="font-semibold mb-2">
                Câu trả lời của người dùng:
              </h3>
              <div className="space-y-1">
                {Array.isArray(sub.answers) &&
                  sub.answers.map((ansObj: any, i: number) => {
                    const [key, value] = Object.entries(ansObj)[0] || [];
                    return (
                      <div key={i} className="text-gray-700">
                        <span className="font-medium">{key}:</span>{" "}
                        {String(value)}
                      </div>
                    );
                  })}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

import { useEffect, useState } from "react";
import { Copy, Link as LinkIcon } from "lucide-react";
import { useForm } from "../stores/useForm";

interface ShareExamLinkDialogProps {
  formId: string;
}

export default function ShareExamLinkDialog({
  formId,
}: ShareExamLinkDialogProps) {
  const [openDialog, setOpenDialog] = useState(false);

  const examLink = `${window.location.origin}/exam/${formId}`;

  const {
    requireLogin,
    oneSubmissionOnly,
    enableTimer,
    timerMinutes,
    setSettings,
    saveForm,
  } = useForm();

  // Tự động lưu
  useEffect(() => {
    const timer = setTimeout(() => {
      saveForm();
    }, 800);

    return () => clearTimeout(timer);
  }, [requireLogin, oneSubmissionOnly, enableTimer, timerMinutes]);

  return (
    <div>
      <button
        onClick={() => setOpenDialog(true)}
        className="mt-6 w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer">
        <LinkIcon size={20} />
        Tạo link làm bài
      </button>

      {openDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl relative animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Thu thập câu trả lời
            </h2>

            <p className="text-sm text-gray-600 mb-3">
              Sao chép link bên dưới để gửi cho người làm bài:
            </p>

            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                readOnly
                value={examLink}
                className="w-full px-3 py-2 border rounded-lg text-gray-700 bg-gray-50"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(examLink);
                  alert("Đã sao chép link!");
                }}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-1 cursor-pointer">
                <Copy size={16} />
                Sao chép
              </button>
            </div>

            {/* SETTINGS */}
            <div className="space-y-3 border-t pt-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireLogin}
                  onChange={(e) =>
                    setSettings({ requireLogin: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <span className="text-gray-700 text-sm">
                  Yêu cầu đăng nhập trước khi làm bài
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={oneSubmissionOnly}
                  onChange={(e) =>
                    setSettings({ oneSubmissionOnly: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <span className="text-gray-700 text-sm">
                  Chỉ cho phép nộp bài 1 lần
                </span>
              </label>

              {/* ❗ THÊM GIỚI HẠN THỜI GIAN */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableTimer}
                  onChange={(e) =>
                    setSettings({ enableTimer: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <span className="text-gray-700 text-sm">
                  Giới hạn thời gian làm bài
                </span>
              </label>

              {/* Nếu bật → hiển thị ô chọn phút */}
              {enableTimer && (
                <div className="pl-6 justify-self-start">
                  <input
                    type="number"
                    min={1}
                    value={timerMinutes || ""}
                    onChange={(e) =>
                      setSettings({ timerMinutes: Number(e.target.value) })
                    }
                    className="w-24 px-2 py-1 border rounded-lg"
                    placeholder="Phút"
                  />
                  <span className="ml-2 text-sm text-gray-600">phút</span>
                </div>
              )}
            </div>

            {/* CLOSE */}
            <button
              onClick={() => setOpenDialog(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 cursor-pointer">
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

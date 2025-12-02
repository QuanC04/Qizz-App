import { formatTime } from "@/utils/formatTime";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface TimerProgressProps {
  timerMinutes: number;
  onTimeUp?: () => void;
  formId: string; // thêm formId để phân biệt bài thi
  submissionDone?: boolean; // true nếu đã nộp bài → reset timer
  onStartTimer?: () => void; // callback khi timer bắt đầu
}

export default function TimerProgress({
  timerMinutes,
  onTimeUp,
  formId,
  submissionDone = false,
  onStartTimer,
}: TimerProgressProps) {
  const TOTAL_TIME = timerMinutes * 60;

  const STORAGE_KEY = `exam-start-${formId}`;

  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

  // === Khởi tạo timer với localStorage ===
  useEffect(() => {
    if (submissionDone) {
      localStorage.removeItem(STORAGE_KEY);
      setTimeLeft(TOTAL_TIME);
      return;
    }

    let startTime = localStorage.getItem(STORAGE_KEY);

    if (!startTime) {
      // lần đầu vào → lưu startTime
      startTime = Date.now().toString();
      localStorage.setItem(STORAGE_KEY, startTime);
      onStartTimer && onStartTimer();
    }

    // Tính timeLeft remaining
    const elapsed = Math.floor((Date.now() - Number(startTime)) / 1000);
    const newTimeLeft = TOTAL_TIME - elapsed;

    setTimeLeft(newTimeLeft > 0 ? newTimeLeft : 0);

    if (newTimeLeft <= 0 && onTimeUp) onTimeUp();
  }, [submissionDone]);

  // === Đếm ngược ===
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp && onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex items-center gap-3 mb-4">
      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${(timeLeft / TOTAL_TIME) * 100}%` }}></div>
      </div>

      <div className="flex items-center gap-1 font-semibold text-lg">
        <span>
          <Clock size={19} />
        </span>
        <span>{formatTime(timeLeft)}</span>
      </div>
    </div>
  );
}

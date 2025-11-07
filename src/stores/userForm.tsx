import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { nanoid } from "nanoid";
import { create } from "zustand";
import { db } from "../services/firebaseConfig";

interface Question {
  type: string;
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number | number[] | string | null;
  score: number;
}

interface Title {
  titleText: string;
  description: string;
}
interface FormData {
  formId: string;
  title: Title;
  questions: Question[];
}
interface Submissions {
  userId: string;
  answer: Record<string, any>[];
  totalScore: number;
  submitAt: Date;
}
interface FormState {
  formId: string;
  title: Title;
  questions: Question[];
  status: string;
  createdBy: string;
  setTitle: (titleText: string, description: string) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  saveForm: () => Promise<void>;
  updateForm: () => void;
  resetForm: () => void;
  getAllForm: () => Promise<FormData[]>;
  getForm: (formId: string) => Promise<FormData | null>;
  getSubmissionForm: (formId: string) => Promise<Submissions[]>;
  deleteForm: (formId: string) => Promise<FormData[]>;
  submitForm: (
    formId: string,
    userId: string,
    answers: Record<string, any>[]
  ) => Promise<void>;
}
export const useForm = create<FormState>((set, get) => ({
  formId: nanoid(),
  title: { titleText: "", description: "" },
  questions: [],
  status: "public",
  createdBy: "",
  setTitle: (titleText, description) =>
    set((state) => ({
      title: { ...state.title, titleText, description },
    })),

  addQuestion: (question) =>
    set((state) => ({
      questions: [...state.questions, { ...question, id: nanoid() }],
    })),

  updateQuestion: (id, updates) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === id ? { ...q, ...updates } : q
      ),
    })),
  deleteQuestion: (id) =>
    set((state) => ({
      questions: state.questions.filter((q) => q.id !== id),
    })),
  saveForm: async () => {
    try {
      const { formId, title, questions, status, createdBy } = get();
      const formData = {
        formId,
        title,
        createdBy,
        questions,
        status,
        createdAt: Date(),
      };
      await setDoc(doc(db, "forms", formId), formData, { merge: true });
      alert("Form đã được lưu thành công!");
    } catch (err) {
      alert(" Lưu form thất bại!");
    }
  },
  resetForm: () =>
    set(() => ({
      formId: nanoid(),
      title: { titleText: "", description: "" },
      questions: [],
    })),
  updateForm: () =>
    set(() => ({
      title: { titleText: "", description: "" },
      questions: [],
    })),
  getAllForm: async () => {
    try {
      const query = await getDocs(collection(db, "forms"));
      const forms = query.docs.map((doc) => ({
        formId: doc.id,
        ...doc.data(),
      })) as FormData[];
      return forms;
    } catch (err) {
      console.error("lỗi:", err);
      return [];
    }
  },
  getForm: async (formId) => {
    try {
      const docSnap = await getDoc(doc(db, "forms", formId));
      const form = docSnap.data() as FormData;
      set({
        formId: form.formId,
        title: form.title,
        questions: form.questions,
      });
      return form;
    } catch (err) {
      console.error("lỗi:", err);
      return null;
    }
  },
  getSubmissionForm: async (formId) => {
    try {
      const snap = await getDocs(
        collection(db, "forms", formId, "submissions")
      );
      const submissions = snap.docs.map((doc) => ({
        userId: doc.id,
        ...doc.data(),
      })) as Submissions[];
      return submissions;
    } catch (err) {
      console.error("lỗi: ", err);
      return [];
    }
  },
  deleteForm: async (formId) => {
    try {
      await deleteDoc(doc(db, "forms", formId));
      alert("Xóa form thành công");
      const snapshot = await getDocs(collection(db, "forms"));
      const forms = snapshot.docs.map((doc) => ({
        formId: doc.id,
        ...doc.data(),
      })) as FormData[];
      return forms;
    } catch (err) {
      console.error("Xóa form thất bại");
      return [];
    }
  },
  submitForm: async (formId, userId, answers) => {
    try {
      const { getForm } = get();
      const formData = await getForm(formId);
      const labels = ["A", "B", "C", "D", "E", "F", "G", "H"];
      let totalScore = 0;
      const userSnap = await getDoc(doc(db, "users", userId));
      const userData = userSnap.data();
      const userEmail = userData?.email || "Không rõ";
      //   Tính  Điểm
      formData?.questions.forEach((question) => {
        const answerObject = answers.find(
          (a) => Object.keys(a)[0] === question.id
        );
        const userAnswer = answerObject ? Object.values(answerObject)[0] : null;
        if (question.type === "checkbox") {
          const correctAnswer = question.correctAnswer as number[];
          const isCorrect =
            userAnswer?.length === correctAnswer?.length &&
            userAnswer.every((ans: number) => correctAnswer.includes(ans));
          if (isCorrect) totalScore += question.score;
        } else if (userAnswer === question.correctAnswer)
          totalScore += question.score;
      });
      //   format answer
      const convertedAnswers: Record<string, any>[] = [];
      formData?.questions.forEach((q, index) => {
        const answerObject = answers.find((a) => Object.keys(a)[0] === q.id);
        const userAnswer = answerObject ? Object.values(answerObject)[0] : null;
        let formattedAnswer: string | null = null;

        if (Array.isArray(userAnswer)) {
          formattedAnswer = userAnswer
            .map((userAnswer) => labels[userAnswer])
            .join(",");
        } else if (typeof userAnswer === "number" && q.type === "radio") {
          formattedAnswer = labels[userAnswer];
        } else {
          formattedAnswer = userAnswer ?? null;
        }
        convertedAnswers.push({
          [`Câu ${index + 1}`]: formattedAnswer,
        });
      });
      await setDoc(doc(db, "forms", formId, "submissions", userId), {
        userId,
        userEmail,
        answers: convertedAnswers,
        totalScore,
        submitAt: new Date().toISOString(),
      });
      alert(`Nộp bài thành công \nBạn đạt được ${totalScore} điểm`);
    } catch (err) {
      console.error("Lỗi: ", err);
    }
  },
}));

import {
  addDoc,
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
interface FormState {
  formId: string;
  title: Title;
  questions: Question[];
  status: string;
  setTitle: (titleText: string, description: string) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  saveForm: () => Promise<void>;
  updateForm: () => void;
  resetForm: () => void;
  getAllForm: () => Promise<FormData[]>;
  getForm: (formId: string) => Promise<FormData | null>;
  deleteForm: (formId: string) => Promise<FormData[]>;
  submitForm: (
    formId: string,
    userId: string,
    answers: Record<string, any>
  ) => Promise<void>;
}
export const useForm = create<FormState>((set, get) => ({
  formId: nanoid(),
  title: { titleText: "", description: "" },
  questions: [],
  status: "draft",
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
        q.id == id ? { ...q, ...updates } : q
      ),
    })),
  deleteQuestion: (id) =>
    set((state) => ({
      questions: state.questions.filter((q) => q.id !== id),
    })),
  saveForm: async () => {
    try {
      const { formId, title, questions, status } = get();
      const formData = {
        formId,
        title,
        questions,
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
      let totalScore = 0;
      formData?.questions.forEach((question) => {
        const userAnswer = answers[question.id];
        if (question.type === "checkbox") {
          const correctAnswer = question.correctAnswer as number[];
          const isCorrect =
            answers[question.id].length === correctAnswer?.length &&
            answers[question.id].every((ans: number) =>
              correctAnswer.includes(ans)
            );
          if (isCorrect) totalScore += question.score;
        } else if (userAnswer === question.correctAnswer)
          totalScore += question.score;
      });
      await addDoc(collection(db, "forms", formId, "submissions"), {
        userId,
        answers,
        totalScore,
        submitAt: new Date().toISOString(),
      });
      alert(`Nộp bài thành công \nBạn đạt được ${totalScore} điểm`);
    } catch (err) {
      console.error("Lỗi: ", err);
    }
  },
}));

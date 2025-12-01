import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { create } from "zustand";
import { auth, db } from "../services/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface User {
  id: string;
  email: string;
  createAt: string;

}
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string;
  handleLogin: (
    email: string,
    password: string
  ) => Promise<Partial<User> | undefined>;
  handleGoogleLogin: (navigate:any) => Promise<void>;
  handleRegister: (email: string, password: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  getUser: (userId: string) => Promise<User | null>;
  initAuth: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: { id: "", email: "", createAt: "" },
  loading: false,
  error: "",
  handleLogin: async (email, password) => {
    set({ loading: true });
    set({ error: "" });
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const snapShot = await getDoc(doc(db, "users", user.uid));
      const userData = snapShot.data();
      if (!userData) {
        set({ error: "Không tìm thấy thông tin người dùng." });
        set({ loading: false });
        return;
      }
      set({
        user: {
          id: userData.id,
          email: userData.email,
          createAt: userData.createAt,
        },
      });
      set({ loading: false });

      return {
        id: user.uid,
        email: userData.email,
        createAt: userData.createAt,
      };
    } catch (err: any) {
      console.error("Lỗi đăng nhập:", err);
      if (err.code === "auth/user-not-found")
        set({ error: "Email không tồn tại." });
      else if (err.code === "auth/wrong-password")
        set({ error: "Sai mật khẩu" });
      else set({ error: "Đăng nhập thất bại, thử lại sau." });
      set({ loading: false });
    }
  },
  handleGoogleLogin: async (navigate) => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);

      const user = userCredential.user;
       const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

    // Nếu user chưa tồn tại → tạo mới
    if (!snap.exists()) {
      await setDoc(userRef, {
        id: user.uid,
        email: user.email,
        createdAt: new Date().toISOString(),
      });
    }

     navigate({ to: "/form" });

    } catch (error) {
      console.error("lỗi đăng nhập :", error);
    }
  },
  handleRegister: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        email,
        password,
        createAt: new Date(),
      });
      alert("Đăng ký thành công");
    } catch (err) {
      console.log("Lỗi Đăng Ký: ", err);
    }
  },
  handleLogout: async () => {
    await auth.signOut();
    set({ user: null });
  },
  getUser: async (userId) => {
    try {
      const snap = await getDoc(doc(db, "users", userId));
      const userData = snap.data();
      return userData as User;
    } catch (err) {
      console.error("lỗi: ", err);
      return null;
    }
  },
  initAuth: () => {
    set({ loading: true });
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snapShot = await getDoc(doc(db, "users", user.uid));
        const userData = snapShot.data();
        set({
          user: {
            id: userData?.id,
            email: userData?.email,
            createAt: userData?.createAt,
          },
          loading: false,
        });
      } else {
        set({ user: null, loading: false });
      }
    });
  },
}));

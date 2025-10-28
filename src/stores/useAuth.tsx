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
  role: string;
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
  handleGoogleLogin: () => Promise<void>;
  handleRegister: (
    email: string,
    password: string,
    role: string
  ) => Promise<void>;
  handleLogout: () => Promise<void>;
  initAuth: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: { id: "", email: "", password: "", role: "", createAt: "" },
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
          role: userData.role,
          createAt: userData.createAt,
        },
      });
      set({ loading: false });

      return {
        id: user.uid,
        email: userData.email,
        role: userData.role,
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
  handleGoogleLogin: async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      console.log("Đăng nhập thành công", userCredential.user);
    } catch (error) {
      console.error("lỗi đăng nhập :", error);
    }
  },
  handleRegister: async (email, password, role) => {
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
        role,
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
            role: userData?.role,
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

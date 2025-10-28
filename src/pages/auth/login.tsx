import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, FacebookIcon } from "lucide-react";
import { useState } from "react";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useAuth } from "../../stores/useAuth";
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin, handleGoogleLogin, loading, error, user } = useAuth();
  const navigate = useNavigate();

  const onLogin = async () => {
    const userData = await handleLogin(email, password);
    if (userData?.role === "admin") navigate({ to: "/admin" });
    else if (userData?.role === "user") navigate({ to: "/user" });
    console.log(user);
  };

  return (
    <div className="flex items-center justify-center w-full ">
      <div className=" flex flex-col items-center justify-center gap-y-2  h-[650px] w-[450px] rounded-xl shadow-xl border border-gray-100">
        <img
          src="\Quizizz-Basic-app-icon.svg"
          alt="logo"
          className="h-30 w-30 scale-150"
        />
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Chào mừng trờ lại
        </h2>
        <div className=" w-full mt-5 p-6 items-start">
          <label className=" block text-sm font-medium text-gray-700 w-full text-left p-1">
            Email
          </label>
          <input
            type="email"
            name="email1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="dfsaf@gmail.com"
            className="border w-full h-12 placeholder:text-gray-400 rounded-lg p-2  border-gray-200 text-gray-900 disabled:opacity-50"
          />
        </div>
        <div className=" w-full relative mt-0 p-6 pt-0">
          <label className="block text-sm font-medium text-gray-700 w-full text-left p-1">
            Mật Khẩu
          </label>
          <input
            type={!showPassword ? "password" : "text"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="border w-full h-12 placeholder:text-gray-400 rounded-lg p-2  border-gray-200 text-gray-900 disabled:opacity-50"
          />
          <button
            className="absolute top-4/10 right-9 hover:bg-gray-200 cursor-pointer rounded-md"
            onClick={() => setShowPassword(!showPassword)}>
            {!showPassword ? <EyeOff /> : <Eye />}
          </button>
          <Link
            to="/forgot-password"
            className="absolute top-2 right-6 text-xs hover:underline text-black">
            Quên Mật Khẩu?
          </Link>
        </div>
        <button
          className="border h-10 w-9/10 rounded-md bg-black cursor-pointer font-medium text-white mt-5"
          onClick={() => onLogin()}>
          Đăng Nhập
        </button>
        <p>
          Bạn chưa có tài khoản ?{" "}
          <Link
            to="/register"
            className="hover:underline text-black  font-semibold">
            Đăng ký ngay
          </Link>
        </p>
        <div className="flex items-center my-4 w-full">
          <div className="flex-1 h-[1.5px] bg-gray-300"></div>
          <span className="px-4 text-sm text-gray-400 whitespace-nowrap">
            Hoặc tiếp tục với
          </span>
          <div className="flex-1 h-[1.5px] bg-gray-300"></div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-[10px]">
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-200 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)] cursor-pointer"
            type="submit"
            onClick={handleGoogleLogin}>
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Google
            </span>
          </button>
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-200 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)] cursor-pointer"
            type="submit">
            <FacebookIcon className="h-4 w-4 text-neutral-800 dark:text-neutral-300 " />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Facebook
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

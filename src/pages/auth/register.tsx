import { EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../../stores/useAuth";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [role, setRole] = useState("");
  const { handleRegister } = useAuth();
  return (
    <div className="flex items-center justify-center w-full ">
      <div className="flex flex-col items-center justify-center gap-y-2  h-[650px] w-[450px] rounded-xl shadow-xl border border-gray-100">
        <h1>Đăng ký</h1>
        <div className=" w-full mt-5 p-6 items-start">
          <label className=" block text-sm font-medium text-gray-700 w-full text-left p-1">
            Email
          </label>
          <input
            type="email"
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
        </div>
        <div className=" w-full relative mt-0 p-6 pt-0 flex">
          <div className="w-2/3">
            <label className="block text-sm font-medium text-gray-700 w-full text-left p-1">
              Nhập Lại Mật Khẩu
            </label>
            <input
              type="password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              placeholder="••••••••"
              className={`border w-full h-12  rounded-lg p-2   text-gray-900 disabled:opacity-50 focus:ring-0  ${
                rePassword && rePassword !== password
                  ? "border-red-500 placeholder:text-red-400 focus:border-red-500 focus:outline-none"
                  : "border-gray-200 placeholder:text-gray-400 "
              }`}
            />
          </div>
          <div className="w-1/3 ml-3">
            <label className="block text-sm font-medium text-gray-700 w-full text-left p-1">
              Vai Trò
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              name="role"
              id="role"
              className="w-full border border-gray-300 rounded-lg h-12 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black">
              <option value="">Chọn vai trò </option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>

        <button
          className="border h-10 w-9/10 rounded-md bg-black cursor-pointer font-medium text-white mt-5"
          onClick={() => handleRegister(email, password, role)}>
          Đăng Ký
        </button>

        <p>
          Bạn đã có tài khoản ?{" "}
          <Link
            to="/login"
            className="hover:underline text-black  font-semibold">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

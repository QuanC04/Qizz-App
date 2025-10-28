import { Link } from "@tanstack/react-router";
import { useState } from "react";

export default function Header() {
  const [isActive, setIsActive] = useState("discover");
  return (
    <nav>
      <div className=" fixed z-10 top-0 right-0 left-0 m-30 items-center justify-between flex mt-15">
        <div className="flex gap-x-4 items-center">
          <Link to="/" className="flex ">
            <img
              src="\Quizizz-Basic-app-icon.svg"
              alt="logo"
              className="w-10 h-10 overflow-hidden scale-150"
            />
            <p className="text-3xl font-bold pb-[5px]">Qizz</p>
          </Link>
          <Link to="/discover">
            <p
              className={`font-bold font-sans ${
                isActive === "discover"
                  ? "text-purple-600 underline underline-offset-4"
                  : "text-gray-700 hover:text-purple-500"
              }`}
              onClick={() => setIsActive("discover")}>
              Khám Phá Qizz
            </p>
          </Link>
          <Link to="/leaderboard">
            <p
              className={`font-bold font-sans ${
                isActive === "leaderboard"
                  ? "text-purple-600 underline underline-offset-4"
                  : "text-gray-700 hover:text-purple-500"
              }`}
              onClick={() => setIsActive("leaderboard")}>
              Bảng Xếp Hạng
            </p>
          </Link>
          <Link to="/about">
            <p
              className={`font-bold font-sans ${
                isActive === "about"
                  ? "text-purple-600 underline underline-offset-4"
                  : "text-gray-700 hover:text-purple-500"
              }`}
              onClick={() => setIsActive("about")}>
              About
            </p>
          </Link>
        </div>
        <div className="justify-self-end items-center flex gap-x-4">
          <Link to="/register">
            <button className="h-13 w-25 rounded-[40px] cursor-pointer font-semibold border-solid border-[2px] shadow-md hover:shadow-lg ">
              Đăng Ký
            </button>
          </Link>
          <Link to="/login">
            <button className="h-13 w-25 rounded-[40px] bg-[#9266cf] font-semibold cursor-pointer text-white shadow-md hover:shadow-lg">
              Đăng Nhập
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

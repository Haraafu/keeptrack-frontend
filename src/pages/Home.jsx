import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Home() {
  const [activeTab, setActiveTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const switchTab = (tab) => {
    setUsername("");
    setPassword("");
    setActiveTab(tab);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Username dan password wajib diisi.");
      return;
    }

    try {
      if (activeTab === "login") {
        const res = await API.post("/auth/login", { username, password });
        localStorage.setItem("token", res.data.token);
        navigate("/notes");
      } else {
        const res = await API.post("/auth/register", { username, password });
        alert(res.data.message);
        setActiveTab("login");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Terjadi kesalahan.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-950 text-white">
      <div className="relative w-full md:w-1/2 flex flex-col justify-center items-center h-64 md:h-auto">
        <div className="absolute inset-0">
          <img src="/home.webp" alt="home" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-extrabold mb-4 text-white drop-shadow-lg z-10 text-center">
          KeepTrack
        </h1>
        <p className="text-base md:text-xl lg:text-2xl text-white/90 text-center max-w-md z-10 mt-2 md:mt-4 px-4">
          Langkah besar berawal dari hal yang tertulis
        </p>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-10 md:px-6 md:py-0">
        <div className="w-full max-w-md bg-gray-900 rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex mb-6 justify-center">
            <button
              className={`w-1/2 px-4 py-2 rounded-l font-semibold ${
                activeTab === "login" ? "bg-blue-600" : "bg-gray-700"
              }`}
              onClick={() => switchTab("login")}
            >
              Login
            </button>
            <button
              className={`w-1/2 px-4 py-2 rounded-r font-semibold ${
                activeTab === "register" ? "bg-blue-600" : "bg-gray-700"
              }`}
              onClick={() => switchTab("register")}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-semibold"
            >
              {activeTab === "login" ? "Masuk" : "Daftar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";

export default function Sidebar({ notes, onSelect, onCreate, activeId }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username || "User";
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <aside className="w-64 bg-gray-900 p-4 flex flex-col shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">KeepTrack</h2>

      <div className="text-sm text-gray-400 mb-4">
        👤 {username}
        <button
          onClick={handleLogout}
          className="ml-2 text-red-400 text-xs hover:text-red-500 underline"
        >
          Logout
        </button>
      </div>

      <button
        className="bg-blue-600 hover:bg-blue-500 text-white py-2 rounded mb-4 transition"
        onClick={onCreate}
      >
        + Catatan Baru
      </button>

      <div className="text-sm text-gray-400 mb-2">Daftar Catatan</div>

      <div className="space-y-2 overflow-y-auto max-h-[60vh]">
        {notes.map((note) => (
          <button
            key={note._id}
            onClick={() => onSelect(note._id)}
            className={`block w-full text-left px-2 py-1 rounded ${
              note._id === activeId
                ? "bg-blue-700 text-white"
                : "hover:bg-gray-800 text-gray-200"
            }`}
          >
            {note.title || "Tanpa Judul"}
          </button>
        ))}
      </div>
    </aside>
  );
}

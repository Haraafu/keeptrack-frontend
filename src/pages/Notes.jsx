import Editor from "../assets/components/Editor";
import NoteList from "../assets/components/NoteList";
import Sidebar from "../assets/components/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [activeTag, setActiveTag] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await API.get("/notes");
        setNotes(res.data);
      } catch (err) {
        console.error("Gagal ambil notes:", err);
      }
    };
    fetchNotes();
  }, []);

  const createNote = async () => {
    try {
      const res = await API.post("/notes", {
        title: "Untitled Note",
        content: "",
        tags: [],
      });
      setNotes([res.data, ...notes]);
      setActiveNoteId(res.data._id);
    } catch (err) {
      console.error("Gagal buat note:", err);
    }
  };

  const updateNote = async (id, updatedFields) => {
    try {
      const res = await API.put(`/notes/${id}`, updatedFields);
      setNotes((prev) =>
        prev.map((note) => (note._id === id ? res.data : note))
      );
    } catch (err) {
      console.error("Gagal update note:", err);
    }
  };

  const deleteNote = async (id) => {
    try {
      await API.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id));
      if (activeNoteId === id) setActiveNoteId(null);
    } catch (err) {
      console.error("Gagal hapus note:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };  

  const activeNote = notes.find((n) => n._id === activeNoteId);

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      {/* 🔵 HEADER */}
      <header className="flex items-center justify-between bg-gray-900 px-6 py-3 shadow">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-xl font-bold hover:text-cyan-400"
          >
            ☰
          </button>
          <h1 className="text-2xl font-bold text-cyan-400">KeepTrack</h1>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-red-400 hover:text-red-500"
        >
          Logout
        </button>
      </header>
  
      <div className="flex flex-1 overflow-hidden">
        {/* 🔵 SIDEBAR */}
        {sidebarOpen && (
          <Sidebar
            notes={notes}
            onSelect={setActiveNoteId}
            onCreate={createNote}
            activeId={activeNoteId}
          />
        )}
  
        <main className="flex-1 py-6 px-6 md:px-20 overflow-y-auto">
          {activeNote ? (
            <Editor
              note={activeNote}
              onUpdate={updateNote}
              onDelete={deleteNote}
              onBack={() => setActiveNoteId(null)}
            />
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Notes</h1>
              </div>
  
              {/* 🔵 Tag Filter */}
              {notes.some((note) => note.tags && note.tags.length > 0) && (
                <div className="mb-6">
                  <div className="text-gray-400 mb-2">Filter by tag:</div>
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(notes.flatMap((note) => note.tags || []))].map(
                      (tag) => (
                        <button
                          key={tag}
                          onClick={() =>
                            setActiveTag(activeTag === tag ? null : tag)
                          }
                          className={`px-3 py-1 rounded text-sm ${
                            activeTag === tag
                              ? "bg-blue-700 text-white"
                              : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                          }`}
                        >
                          {tag}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
  
              <NoteList
                notes={
                  activeTag
                    ? notes.filter((n) => n.tags?.includes(activeTag))
                    : notes
                }
                onSelect={setActiveNoteId}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );  
}
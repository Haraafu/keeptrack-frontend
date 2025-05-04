import { useState, useEffect, useRef } from "react";

export default function Editor({ note, onUpdate, onDelete, onBack }) {
  const [title, setTitle] = useState(note.title || "");
  const [content, setContent] = useState(note.content || "");
  const [tags, setTags] = useState(note.tags || []);
  const [newTag, setNewTag] = useState("");
  const [editingTagIndex, setEditingTagIndex] = useState(null);
  const [editedTag, setEditedTag] = useState("");

  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags || []);
  }, [note]);

  const handleSave = () => {
    onUpdate(note._id, { title, content, tags });
  };

  const handleBack = () => {
    handleSave();
    onBack();
  };

  const addTag = () => {
    const cleaned = newTag.trim();
    if (!cleaned || tags.includes(cleaned)) return;
    setTags([...tags, cleaned]);
    setNewTag("");
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const startEditTag = (index) => {
    setEditingTagIndex(index);
    setEditedTag(tags[index]);
  };

  const confirmEditTag = () => {
    if (!editedTag.trim()) return;
    const updated = [...tags];
    updated[editingTagIndex] = editedTag.trim();
    setTags(updated);
    setEditingTagIndex(null);
    setEditedTag("");
  };

  // ⏱ Auto save saat user berhenti mengetik selama 1.5 detik
  useEffect(() => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onUpdate(note._id, { title, content, tags });
    }, 1500);

    return () => clearTimeout(typingTimeoutRef.current);
  }, [title, content, tags]);

  return (
    <div className="flex flex-col h-full">
      {/* Header editor */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleBack}
          className="px-4 py-1 rounded bg-gray-100 text-black hover:bg-gray-200"
        >
          ← Kembali
        </button>
        <button
          onClick={() => onDelete(note._id)}
          className="font-semibold bg-red-600 hover:bg-red-500 px-4 py-2 rounded text-white"
        >
          Hapus Note Ini
        </button>
      </div>

      {/* Input judul dan isi */}
      <div className="bg-gray-900 rounded-lg p-4 flex-1 mb-4 overflow-auto">
        <input
          className="bg-transparent text-white text-2xl font-bold mb-2 w-full outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul Catatan"
        />
        <textarea
          className="w-full h-[60vh] bg-transparent text-white resize-none outline-none"
          placeholder="Isi catatan..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* Tag section */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <div className="text-white mb-2">🏷 Tags</div>

        <div className="flex flex-wrap gap-2 mb-3">
          <input
            type="text"
            className="px-3 py-1 rounded text-black w-full sm:w-auto"
            placeholder="Tambah tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
          />
          <button
            onClick={addTag}
            className="bg-blue-700 px-3 py-1 rounded text-white text-sm"
          >
            + Tambah
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {tags.map((tag, index) =>
            editingTagIndex === index ? (
              <div key={index} className="flex items-center gap-1">
                <input
                  value={editedTag}
                  onChange={(e) => setEditedTag(e.target.value)}
                  className="px-2 py-1 rounded text-black"
                  onKeyDown={(e) => e.key === "Enter" && confirmEditTag()}
                />
                <button
                  onClick={confirmEditTag}
                  className="text-xs text-white px-2 py-1 bg-green-600 rounded hover:bg-green-500"
                >
                  ✔
                </button>
              </div>
            ) : (
              <div
                key={index}
                className="bg-blue-700 px-3 py-1 rounded text-sm flex items-center gap-1"
              >
                <span
                  onClick={() => startEditTag(index)}
                  className="cursor-pointer"
                  title="Klik untuk edit"
                >
                  {tag}
                </span>
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-red-300 hover:text-red-500"
                  title="Hapus tag"
                >
                  ✕
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

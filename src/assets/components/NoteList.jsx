export default function NoteList({ notes, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
      {notes.map((note) => (
        <div
          key={note._id}
          onClick={() => onSelect(note._id)}
          className="bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-700 cursor-pointer transition"
        >
          <div className="font-semibold text-white truncate">
            {note.title || "Untitled Note"}
          </div>
          <div className="text-sm text-gray-400 mt-2 line-clamp-2">
            {note.content || "No content"}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {new Date(note.updatedAt).toLocaleTimeString()}
          </div>
        </div>
      ))}
    </div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import type { Note } from "@/data/mockData";

interface StickyNotesProps {
  initialNotes: Note[];
}

const StickyNotes = ({ initialNotes }: StickyNotesProps) => {
  const [notes, setNotes] = useState(initialNotes);
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([
        { id: Date.now().toString(), content: newNote, createdAt: 'Just now' },
        ...notes,
      ]);
      setNewNote('');
      setIsAdding(false);
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card rounded-2xl p-6 shadow-soft border border-border"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl font-semibold">Quick Notes</h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 rounded-full bg-gold text-foreground hover:shadow-glow transition-shadow"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Add Note Form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4"
        >
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Type your note..."
            className="w-full p-3 rounded-xl border bg-amber-50 border-amber-200 resize-none focus:outline-none focus:ring-2 focus:ring-gold"
            rows={3}
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={addNote}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium btn-pressed"
            >
              Add Note
            </button>
            <button
              onClick={() => { setIsAdding(false); setNewNote(''); }}
              className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium btn-pressed"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {notes.map((note, index) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="sticky-note group relative"
          >
            <button
              onClick={() => deleteNote(note.id)}
              className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
            <p className="text-sm text-amber-900 mb-2">{note.content}</p>
            <p className="text-xs text-amber-600">{note.createdAt}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StickyNotes;

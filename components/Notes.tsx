import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { Plus, Trash2, Save, FileText } from 'lucide-react';

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  
  // Load notes
  useEffect(() => {
    const saved = localStorage.getItem('fcm_notes');
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);

  // Save notes
  useEffect(() => {
    localStorage.setItem('fcm_notes', JSON.stringify(notes));
  }, [notes]);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      updatedAt: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeNoteId === id) setActiveNoteId(null);
  };

  const activeNote = notes.find(n => n.id === activeNoteId);

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-6">
      {/* Sidebar List */}
      <div className="w-1/3 bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="font-semibold text-white">My Notes</h3>
          <button onClick={createNote} className="text-blue-400 hover:text-blue-300">
            <Plus size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
           {notes.length === 0 && (
               <p className="text-center text-slate-500 mt-10 text-sm">No notes yet.</p>
           )}
           {notes.map(note => (
             <div 
               key={note.id}
               onClick={() => setActiveNoteId(note.id)}
               className={`p-4 border-b border-slate-700/50 cursor-pointer transition-colors ${activeNoteId === note.id ? 'bg-blue-600/10 border-l-4 border-l-blue-500' : 'hover:bg-slate-700/30 border-l-4 border-l-transparent'}`}
             >
               <h4 className={`font-medium truncate ${activeNoteId === note.id ? 'text-blue-400' : 'text-slate-300'}`}>
                 {note.title || 'Untitled Note'}
               </h4>
               <p className="text-xs text-slate-500 mt-1 truncate">
                 {note.content || 'No content...'}
               </p>
             </div>
           ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 bg-slate-800/30 rounded-2xl border border-slate-700 flex flex-col overflow-hidden relative">
        {activeNote ? (
          <>
            <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-900/30">
               <input
                 type="text"
                 value={activeNote.title}
                 onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                 className="bg-transparent text-xl font-bold text-white focus:outline-none w-full"
                 placeholder="Note Title"
               />
               <button 
                 onClick={() => deleteNote(activeNote.id)}
                 className="text-slate-500 hover:text-red-400 transition-colors"
               >
                 <Trash2 size={20} />
               </button>
            </div>
            <textarea
              value={activeNote.content}
              onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
              className="flex-1 w-full bg-transparent p-6 text-slate-200 resize-none focus:outline-none leading-relaxed"
              placeholder="Start typing..."
            />
            <div className="absolute bottom-4 right-4 text-xs text-slate-500 flex items-center gap-1">
               <Save size={12} /> Auto-saved
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <FileText size={48} className="mb-4 opacity-20" />
            <p>Select a note or create a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
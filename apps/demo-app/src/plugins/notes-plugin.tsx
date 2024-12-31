'use client';

import { useState } from 'react';

import {
  StickyNote,
  FolderOpen,
  Star,
  Archive,
  Search
} from 'lucide-react';

import type { Plugin } from '../types/plugin';

// Main Notes Component
const NotesHome = () => {
  const [notes, setNotes] = useState([
    { id: 1, title: 'Welcome Note', content: 'Welcome to your notes!', isPinned: true },
    { id: 2, title: 'Meeting Notes', content: 'Discuss project timeline', isPinned: false },
    { id: 3, title: 'Ideas', content: 'New feature ideas...', isPinned: false }
  ]);

  const [newNote, setNewNote] = useState({ title: '', content: '' });

  const addNote = () => {
    if (newNote.title && newNote.content) {
      setNotes([
        ...notes,
        { id: notes.length + 1, ...newNote, isPinned: false }
      ]);
      setNewNote({ title: '', content: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
        <button
          onClick={addNote}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          New Note
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Note Title"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            className="w-full p-2 border rounded-lg"
          />
          <textarea
            placeholder="Note Content"
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            className="w-full p-2 border rounded-lg h-32"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{note.title}</h3>
                {note.isPinned && (
                  <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
                )}
              </div>
              <p className="mt-2 text-gray-600">{note.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Folders Component
const FoldersComponent = () => {
  const [folders] = useState([
    { id: 1, name: 'Personal', count: 5 },
    { id: 2, name: 'Work', count: 3 },
    { id: 3, name: 'Projects', count: 2 }
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Folders</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className="p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <FolderOpen className="w-5 h-5 text-blue-500" />
              <div>
                <h3 className="font-medium">{folder.name}</h3>
                <p className="text-sm text-gray-500">{folder.count} notes</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Search Component
const SearchComponent = () => {
  const [searchResults] = useState([
    { id: 1, title: 'Meeting Notes', preview: 'Discuss project timeline...' },
    { id: 2, title: 'Ideas', preview: 'New feature ideas...' }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {searchResults.map((result) => (
          <div
            key={result.id}
            className="p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium">{result.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{result.preview}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Archived Notes Component
const ArchivedNotes = () => {
  const [archived] = useState([
    { id: 1, title: 'Old Project', content: 'Archived project notes...' },
    { id: 2, title: 'Past Meeting', content: 'Previous meeting minutes...' }
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Archived Notes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {archived.map((note) => (
          <div
            key={note.id}
            className="p-4 bg-white rounded-lg shadow-sm border opacity-75"
          >
            <h3 className="font-semibold">{note.title}</h3>
            <p className="mt-2 text-gray-600">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const NotesPlugin: Plugin = {
  name: 'notes',
  version: '1.0.0',
  description: 'A plugin for creating and managing notes',
  author: 'Example Author',

  async initialize() {
    console.log('Notes plugin initialized');

    // Could initialize local storage or load saved notes
  },

  async cleanup() {
    console.log('Notes plugin cleaned up');

    // Could save current notes state
  },

  routes: [
    {
      path: '/notes',
      component: NotesHome,
      icon: StickyNote,
      label: 'Notes',
      group: 'Notes',
    },
    {
      path: '/folders',
      component: FoldersComponent,
      icon: FolderOpen,
      label: 'Folders',
      group: 'Notes',
    },
    {
      path: '/search',
      component: SearchComponent,
      icon: Search,
      label: 'Search',
      group: 'Notes',
    },
    {
      path: '/archived',
      component: ArchivedNotes,
      icon: Archive,
      label: 'Archived',
      group: 'Notes',
    },
  ],

  hooks: {
    onNoteCreate: async (note: any) => {
      console.log('New note created:', note);
    },
    onNoteUpdate: async (note: any) => {
      console.log('Note updated:', note);
    },
    onNoteArchive: async (noteId: string) => {
      console.log('Note archived:', noteId);
    },
  },

  components: {
    NoteCard: ({ title, content, isPinned }: { title: string; content: string; isPinned: boolean }) => (
      <div className="p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold">{title}</h3>
          {isPinned && <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />}
        </div>
        <p className="mt-2 text-gray-600">{content}</p>
      </div>
    ),
  },
};

export default NotesPlugin;

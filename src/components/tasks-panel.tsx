import { useState } from 'react';
import { CheckSquare, Plus, Trash2, Edit2, Archive, StickyNote, Target, ListTodo, X, Calendar, Bell } from 'lucide-react';
import { Task, Note, Lead } from '@/App';
import { ConfirmModal } from './confirm-modal';

interface TasksPanelProps {
  tasks: Task[];
  onAddTask: (title: string, category: string, leadId?: string, dueDate?: number, reminderDate?: number) => void;
  onToggleTask: (taskId: string, completed: boolean) => void;
  onArchiveTask: (taskId: string, archived: boolean) => void;
  onDeleteTask: (taskId: string) => void;
  notes: Note[];
  onAddNote: (title: string, content: string, leadId?: string) => void;
  onArchiveNote: (noteId: string, archived: boolean) => void;
  onDeleteNote: (noteId: string) => void;
  leads: Lead[];
}

export function TasksPanel({ 
  tasks, onAddTask, onToggleTask, onArchiveTask, onDeleteTask,
  notes, onAddNote, onArchiveNote, onDeleteNote,
  leads 
}: TasksPanelProps) {
  const [activeMainTab, setActiveMainTab] = useState<'tasks' | 'notes'>('tasks');
  const [activeSubTab, setActiveSubTab] = useState<'active' | 'completed' | 'archived'>('active');
  
  const [newTask, setNewTask] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<string>('Admin');
  const [newTaskLeadId, setNewTaskLeadId] = useState<string>('');
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>('');
  const [newTaskReminderDate, setNewTaskReminderDate] = useState<string>('');
  const [filterLeadId, setFilterLeadId] = useState<string>('');
  
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteLeadId, setNewNoteLeadId] = useState<string>('');

  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; type: 'task' | 'note'; id: string }>({ isOpen: false, type: 'task', id: '' });

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    // Parse dates
    const dueTime = newTaskDueDate ? new Date(newTaskDueDate).getTime() : undefined;
    const reminderTime = newTaskReminderDate ? new Date(newTaskReminderDate).getTime() : undefined;
    
    onAddTask(newTask, newTaskCategory, newTaskLeadId || undefined, dueTime, reminderTime);
    setNewTask('');
    setNewTaskLeadId('');
    setNewTaskDueDate('');
    setNewTaskReminderDate('');
  };

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    onAddNote(newNoteTitle, newNoteContent, newNoteLeadId || undefined);
    setNewNoteTitle('');
    setNewNoteContent('');
    setNewNoteLeadId('');
  };

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) onToggleTask(id, !task.completed);
  };

  const archiveTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) onArchiveTask(id, !task.archived);
  };

  const archiveNote = (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) onArchiveNote(id, !note.archived);
  };

  const confirmDelete = (type: 'task' | 'note', id: string) => {
    setDeleteConfirm({ isOpen: true, type, id });
  };

  const handleDelete = () => {
    if (deleteConfirm.type === 'task') {
      onDeleteTask(deleteConfirm.id);
    } else {
      onDeleteNote(deleteConfirm.id);
    }
    setDeleteConfirm({ ...deleteConfirm, isOpen: false });
  };

  const filteredTasks = tasks.filter(t => {
    if (filterLeadId && t.leadId !== filterLeadId) return false;
    if (activeSubTab === 'archived') return t.archived;
    if (activeSubTab === 'completed') return t.completed && !t.archived;
    return !t.completed && !t.archived;
  });

  const filteredNotes = notes.filter(n => {
    if (activeSubTab === 'archived') return n.archived;
    return !n.archived;
  });

  const getLeadName = (leadId?: string) => {
    if (!leadId) return null;
    return leads.find(l => l.id === leadId)?.name || 'Unknown Lead';
  };

  return (
    <div className="flex-1 overflow-auto no-scrollbar p-8 lg:p-12 relative flex flex-col">
      <div className="absolute inset-0 bg-grid-zinc bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.05),transparent_50%)] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto w-full relative z-10 flex flex-col h-full">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
              <CheckSquare className="w-6 h-6 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-display font-bold tracking-tight text-zinc-100 mb-2">Tasks & Notes</h1>
            <p className="text-zinc-400 text-sm">Manage your daily hunting tasks and keep track of your progress.</p>
          </div>
          
          <div className="flex bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl p-1 shadow-xl">
            <button
              onClick={() => { setActiveMainTab('tasks'); setActiveSubTab('active'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeMainTab === 'tasks' ? 'bg-indigo-500 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'}`}
            >
              <ListTodo className="w-4 h-4" /> Tasks
            </button>
            <button
              onClick={() => { setActiveMainTab('notes'); setActiveSubTab('active'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeMainTab === 'notes' ? 'bg-indigo-500 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'}`}
            >
              <StickyNote className="w-4 h-4" /> Notes
            </button>
          </div>
        </header>

        <div className="flex gap-4 mb-6 border-b border-zinc-800 pb-2 justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveSubTab('active')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeSubTab === 'active' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
            >
              Active
            </button>
            {activeMainTab === 'tasks' && (
              <button
                onClick={() => setActiveSubTab('completed')}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeSubTab === 'completed' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
              >
                Completed
              </button>
            )}
            <button
              onClick={() => setActiveSubTab('archived')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeSubTab === 'archived' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
            >
              Archived
            </button>
          </div>
          {activeMainTab === 'tasks' && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-500 hidden sm:inline">Filter by Lead:</span>
              <select
                value={filterLeadId}
                onChange={(e) => setFilterLeadId(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 px-3 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="">All Leads</option>
                {leads.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl shadow-xl p-6 mb-8">
          {activeMainTab === 'tasks' ? (
            <>
              {activeSubTab === 'active' && (
                <form onSubmit={addTask} className="flex flex-col gap-4 mb-8 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
                  <div className="flex flex-col gap-4">
                    <input
                      type="text"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      placeholder="Add a new task..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
                    />
                    <div className="flex flex-wrap gap-3 items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500 w-16">Category:</span>
                        <input
                          list="task-categories"
                          value={newTaskCategory}
                          onChange={(e) => setNewTaskCategory(e.target.value)}
                          placeholder="Category"
                          className="bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-32 text-sm"
                        />
                      </div>
                      <datalist id="task-categories">
                        <option value="Admin" />
                        <option value="Lead Generation" />
                        <option value="Outreach" />
                      </datalist>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500 w-10">Lead:</span>
                        <select
                          value={newTaskLeadId}
                          onChange={(e) => setNewTaskLeadId(e.target.value)}
                          className="bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-32 text-sm"
                        >
                          <option value="">No Lead</option>
                          {leads.map(l => (
                            <option key={l.id} value={l.id}>{l.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-zinc-500" />
                        <input 
                          type="datetime-local"
                          value={newTaskDueDate}
                          onChange={(e) => setNewTaskDueDate(e.target.value)}
                          className="bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                          title="Due Date"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-zinc-500" />
                        <input 
                          type="datetime-local"
                          value={newTaskReminderDate}
                          onChange={(e) => setNewTaskReminderDate(e.target.value)}
                          className="bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                          title="Reminder Date"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!newTask.trim()}
                        className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap text-sm ml-auto"
                      >
                        <Plus className="w-4 h-4" /> Add Task
                      </button>
                    </div>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {filteredTasks.map(task => (
                  <div key={task.id} className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border transition-all ${task.completed ? 'bg-zinc-950/50 border-zinc-800/50 opacity-60' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}>
                    <div className="flex items-center gap-4 mb-3 md:mb-0">
                      <button 
                        onClick={() => toggleTask(task.id)}
                        className={`w-6 h-6 rounded flex items-center justify-center border transition-colors shrink-0 ${task.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-zinc-600 hover:border-indigo-500'}`}
                      >
                        {task.completed && <CheckSquare className="w-4 h-4" />}
                      </button>
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${task.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                          {task.title}
                        </span>
                        {task.leadId && (
                          <span className="text-xs text-indigo-400 flex items-center gap-1 mt-1">
                            <Target className="w-3 h-3" /> {getLeadName(task.leadId)}
                          </span>
                        )}
                        {(task.dueDate || task.reminderDate) && (
                          <div className="flex items-center gap-3 mt-1">
                            {task.dueDate && (
                              <span className="text-xs text-zinc-400">
                                Due: {new Date(task.dueDate).toLocaleString()}
                              </span>
                            )}
                            {task.reminderDate && (
                              <span className="text-xs items-center inline-flex bg-zinc-800/80 px-2 py-0.5 rounded text-amber-500/90 border border-amber-500/20">
                                Reminder: {new Date(task.reminderDate).toLocaleString()}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-10 md:ml-0">
                      <span className="text-xs px-2 py-1 rounded-md bg-zinc-800 text-zinc-400 uppercase tracking-wider font-medium">
                        {task.category}
                      </span>
                      <button onClick={() => archiveTask(task.id)} className="text-zinc-500 hover:text-indigo-400 transition-colors" title={task.archived ? "Unarchive" : "Archive"}>
                        <Archive className="w-4 h-4" />
                      </button>
                      <button onClick={() => confirmDelete('task', task.id)} className="text-zinc-500 hover:text-red-400 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredTasks.length === 0 && (
                  <div className="text-center py-12 text-zinc-500">
                    No tasks found in this view.
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {activeSubTab === 'active' && (
                <form onSubmit={addNote} className="flex flex-col gap-4 mb-8 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      placeholder="Note Title..."
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
                    />
                    <select
                      value={newNoteLeadId}
                      onChange={(e) => setNewNoteLeadId(e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-[200px]"
                    >
                      <option value="">No Lead</option>
                      {leads.map(l => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Write your note here..."
                    rows={3}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600 resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newNoteTitle.trim() || !newNoteContent.trim()}
                      className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Note
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredNotes.map(note => (
                  <div key={note.id} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 transition-all flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-zinc-100 font-medium">{note.title}</h3>
                      <div className="flex items-center gap-2">
                        <button onClick={() => archiveNote(note.id)} className="text-zinc-500 hover:text-indigo-400 transition-colors" title={note.archived ? "Unarchive" : "Archive"}>
                          <Archive className="w-4 h-4" />
                        </button>
                        <button onClick={() => confirmDelete('note', note.id)} className="text-zinc-500 hover:text-red-400 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-zinc-400 text-sm whitespace-pre-wrap flex-1 mb-4">{note.content}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800/50">
                      <span className="text-xs text-zinc-500">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                      {note.leadId && (
                        <span className="text-xs text-indigo-400 flex items-center gap-1 bg-indigo-500/10 px-2 py-1 rounded-md">
                          <Target className="w-3 h-3" /> {getLeadName(note.leadId)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {filteredNotes.length === 0 && (
                  <div className="col-span-full text-center py-12 text-zinc-500">
                    No notes found in this view.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title={`Delete ${deleteConfirm.type === 'task' ? 'Task' : 'Note'}`}
        message={`Are you sure you want to delete this ${deleteConfirm.type}? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ ...deleteConfirm, isOpen: false })}
      />
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import type { Task } from '../types.ts';
import { Icon } from './Icon.tsx';
import Modal from './Modal.tsx';
import { PRIORITY_MATRIX_INSTRUCTIONS, INBUILT_SOUNDS } from '../constants.ts';

interface TasksProps {
    tasks: Task[];
    onTaskComplete: (taskId: string) => void;
    onTaskAdd: (task: Task) => void;
    onTaskUpdate: (task: Task) => void;
    onTaskDelete: (taskId: string) => void;
}

type Consequence = 'low' | 'high';
type Leverage = 'low' | 'high';

interface TaskItemProps {
    task: Task;
    onToggle: () => void;
    onDelete: (taskId: string) => void;
    onUpdate: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onUpdate }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    const [editText, setEditText] = useState(task.text);
    const [editSubject, setEditSubject] = useState(task.subject);
    const [editLeverage, setEditLeverage] = useState<Leverage>(task.isImportant ? 'high' : 'low');
    const [editConsequence, setEditConsequence] = useState<Consequence>(task.isUrgent ? 'high' : 'low');
    
    const handleToggle = () => {
        if (!task.completed) {
            new Audio(INBUILT_SOUNDS.Chime).play().catch(e => console.error("Audio play failed:", e));
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 500);
        }
        onToggle();
    };

    const handleSave = () => {
        onUpdate({ ...task, text: editText.trim(), subject: editSubject.trim() || 'General', isImportant: editLeverage === 'high', isUrgent: editConsequence === 'high' });
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg border-2 border-primary-500 space-y-3 shadow-lg animate-fade-in">
                <input type="text" value={editText} onChange={e => setEditText(e.target.value)} placeholder="Task description..." className="w-full bg-light-card dark:bg-dark-card p-2 rounded-md border border-light-border dark:border-dark-border focus:ring-1 focus:ring-primary-500 focus:outline-none text-sm"/>
                <input type="text" value={editSubject} onChange={e => setEditSubject(e.target.value)} placeholder="Subject (optional)..." className="w-full bg-light-card dark:bg-dark-card p-2 rounded-md border border-light-border dark:border-dark-border focus:ring-1 focus:ring-primary-500 focus:outline-none text-sm"/>
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <p className="font-semibold mb-1">Leverage (Importance)</p>
                        <div className="flex bg-gray-200 dark:bg-gray-700 p-0.5 rounded-md">
                           <button onClick={() => setEditLeverage('high')} className={`w-1/2 text-xs rounded-sm py-1 ${editLeverage === 'high' ? 'bg-green-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}>High</button>
                           <button onClick={() => setEditLeverage('low')} className={`w-1/2 text-xs rounded-sm py-1 ${editLeverage === 'low' ? 'bg-green-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}>Low</button>
                        </div>
                     </div>
                     <div>
                        <p className="font-semibold mb-1">Consequence (Urgency)</p>
                        <div className="flex bg-gray-200 dark:bg-gray-700 p-0.5 rounded-md">
                           <button onClick={() => setEditConsequence('high')} className={`w-1/2 text-xs rounded-sm py-1 ${editConsequence === 'high' ? 'bg-orange-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}>High</button>
                           <button onClick={() => setEditConsequence('low')} className={`w-1/2 text-xs rounded-sm py-1 ${editConsequence === 'low' ? 'bg-orange-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}>Low</button>
                        </div>
                     </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                    <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-sm rounded-md bg-gray-200 dark:bg-gray-600 font-semibold">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-1 text-sm rounded-md bg-primary-500 text-white font-semibold">Save</button>
                </div>
            </div>
        );
    }

    return (
    <div className={`group relative flex items-center gap-4 p-3 rounded-lg transition-all duration-300 border animate-fade-in-up ${task.completed ? 'bg-gray-100/50 dark:bg-gray-800/30 border-transparent opacity-60' : 'bg-light-card dark:bg-dark-card border-light-border dark:border-dark-border hover:-translate-y-px hover:shadow-lg'}`}>
        {isAnimating && <div className="absolute inset-0 rounded-lg bg-green-500/20 animate-fade-out"></div>}
        <button onClick={handleToggle} className={`relative w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-400 dark:border-gray-500 hover:border-primary-500'}`}>
            {task.completed && <Icon name="check" className="w-4 h-4 text-white animate-pop-in" />}
            {isAnimating && <Icon name="celebrate" className="absolute w-10 h-10 text-yellow-400 animate-pop-in"/>}
        </button>
        <div className="flex-grow">
            <p className={`font-medium transition-all duration-500 ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.text}</p>
            <span className="text-xs text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded-full">{task.subject}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!task.completed && <button onClick={() => setIsEditing(true)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><Icon name="edit" className="w-4 h-4 text-gray-500" /></button>}
            <button onClick={() => onDelete(task.id)} className="p-1 rounded-full hover:bg-red-500/10"><Icon name="trash" className="w-4 h-4 text-red-500" /></button>
        </div>
    </div>
    );
};

const Quadrant: React.FC<{ name: string; details: string; tasks: Task[]; onTaskComplete: (id: string) => void; onTaskDelete: (id: string) => void; onTaskUpdate: (task: Task) => void; color: string; }> = ({ name, details, tasks, onTaskComplete, onTaskDelete, onTaskUpdate, color }) => (
    <div className={`bg-light-card dark:bg-dark-card rounded-xl shadow-md border-t-4 ${color} p-4 flex flex-col`}>
        <div className="mb-3">
            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{details}</p>
        </div>
        <div className="space-y-3 flex-grow overflow-y-auto pr-1">
            {tasks.length > 0 ? tasks.map(task => <TaskItem key={task.id} task={task} onToggle={() => onTaskComplete(task.id)} onDelete={onTaskDelete} onUpdate={onTaskUpdate} />) : 
            <div className="h-full flex items-center justify-center"><p className="text-sm text-gray-400 dark:text-gray-500">Empty</p></div>}
        </div>
    </div>
);

const Tasks: React.FC<TasksProps> = ({ tasks, onTaskComplete, onTaskAdd, onTaskUpdate, onTaskDelete }) => {
    const [newTaskText, setNewTaskText] = useState('');
    const [newTaskSubject, setNewTaskSubject] = useState('');
    const [consequence, setConsequence] = useState<Consequence>('low');
    const [leverage, setLeverage] = useState<Leverage>('high');
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    
    const [viewMode, setViewMode] = useState<'matrix' | 'list'>('matrix');

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskText.trim() === '') return;
        
        onTaskAdd({
            id: Date.now().toString(),
            text: newTaskText.trim(),
            subject: newTaskSubject.trim() || 'General',
            completed: false,
            isImportant: leverage === 'high',
            isUrgent: consequence === 'high',
        });
        setNewTaskText('');
        setNewTaskSubject('');
    };

    const quadrants = useMemo(() => ({
        q1: tasks.filter(t => t.isImportant && !t.isUrgent && !t.completed), // High Leverage, Low Consequence
        q2: tasks.filter(t => t.isImportant && t.isUrgent && !t.completed),  // High Leverage, High Consequence
        q3: tasks.filter(t => !t.isImportant && t.isUrgent && !t.completed), // Low Leverage, High Consequence
        q4: tasks.filter(t => !t.isImportant && !t.isUrgent && !t.completed),// Low Leverage, Low Consequence
    }), [tasks]);
    
    const completedTasks = useMemo(() => tasks.filter(t => t.completed).sort((a,b) => (b.completionDate && a.completionDate) ? new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime() : 0), [tasks]);
    const allIncompleteTasks = useMemo(() => tasks.filter(t => !t.completed), [tasks]);

    return (
        <div className="space-y-6">
            <div className="bg-light-card dark:bg-dark-card p-4 rounded-lg shadow-sm border border-light-border dark:border-dark-border">
                <form onSubmit={handleAddTask} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                    <div className="sm:col-span-2">
                        <label className="text-sm font-medium">New Task</label>
                        <div className="flex gap-2 mt-1">
                            <input type="text" value={newTaskText} onChange={e => setNewTaskText(e.target.value)} placeholder="What needs to be done?" className="w-full bg-light-bg dark:bg-dark-bg p-2 rounded-md border border-light-border dark:border-dark-border" />
                            <input type="text" value={newTaskSubject} onChange={e => setNewTaskSubject(e.target.value)} placeholder="Subject (optional)" className="w-1/3 bg-light-bg dark:bg-dark-bg p-2 rounded-md border border-light-border dark:border-dark-border" />
                        </div>
                    </div>
                    <div>
                         <label className="text-sm font-medium">Priority</label>
                         <div className="flex gap-2 mt-1 text-xs">
                             <div className="flex-1">
                                 <p className="font-semibold mb-1">Leverage</p>
                                <div className="flex bg-gray-200 dark:bg-gray-700 p-0.5 rounded-md">
                                   <button type="button" onClick={() => setLeverage('high')} className={`w-1/2 rounded-sm py-1 ${leverage === 'high' ? 'bg-green-500 text-white' : ''}`}>High</button>
                                   <button type="button" onClick={() => setLeverage('low')} className={`w-1/2 rounded-sm py-1 ${leverage === 'low' ? 'bg-green-500 text-white' : ''}`}>Low</button>
                                </div>
                             </div>
                              <div className="flex-1">
                                 <p className="font-semibold mb-1">Consequence</p>
                                <div className="flex bg-gray-200 dark:bg-gray-700 p-0.5 rounded-md">
                                   <button type="button" onClick={() => setConsequence('high')} className={`w-1/2 rounded-sm py-1 ${consequence === 'high' ? 'bg-orange-500 text-white' : ''}`}>High</button>
                                   <button type="button" onClick={() => setConsequence('low')} className={`w-1/2 rounded-sm py-1 ${consequence === 'low' ? 'bg-orange-500 text-white' : ''}`}>Low</button>
                                </div>
                             </div>
                         </div>
                    </div>
                    <div className="sm:col-span-3 text-center sm:text-left">
                         <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-primary-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-px active:translate-y-0 w-full sm:w-auto">Add Task</button>
                    </div>
                </form>
            </div>
            
            <div className="flex justify-between items-center">
                <div className="flex bg-light-card dark:bg-dark-card p-1 rounded-full border border-light-border dark:border-dark-border">
                    <button onClick={() => setViewMode('matrix')} className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors ${viewMode === 'matrix' ? 'bg-primary-500 text-white' : ''}`}>Matrix</button>
                    <button onClick={() => setViewMode('list')} className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors ${viewMode === 'list' ? 'bg-primary-500 text-white' : ''}`}>List</button>
                </div>
                <button onClick={() => setIsInfoModalOpen(true)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-500">
                    <Icon name="info" className="w-5 h-5" /> How does this work?
                </button>
            </div>

            <div key={viewMode} className="animate-fade-in">
                {viewMode === 'matrix' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{minHeight: '50vh'}}>
                         <Quadrant name={PRIORITY_MATRIX_INSTRUCTIONS.quadrants[1].name} details={PRIORITY_MATRIX_INSTRUCTIONS.quadrants[1].details} tasks={quadrants.q2} onTaskComplete={onTaskComplete} onTaskDelete={onTaskDelete} onTaskUpdate={onTaskUpdate} color="border-t-orange-500" />
                        <Quadrant name={PRIORITY_MATRIX_INSTRUCTIONS.quadrants[0].name} details={PRIORITY_MATRIX_INSTRUCTIONS.quadrants[0].details} tasks={quadrants.q1} onTaskComplete={onTaskComplete} onTaskDelete={onTaskDelete} onTaskUpdate={onTaskUpdate} color="border-t-green-500" />
                        <Quadrant name={PRIORITY_MATRIX_INSTRUCTIONS.quadrants[2].name} details={PRIORITY_MATRIX_INSTRUCTIONS.quadrants[2].details} tasks={quadrants.q3} onTaskComplete={onTaskComplete} onTaskDelete={onTaskDelete} onTaskUpdate={onTaskUpdate} color="border-t-yellow-500" />
                        <Quadrant name={PRIORITY_MATRIX_INSTRUCTIONS.quadrants[3].name} details={PRIORITY_MATRIX_INSTRUCTIONS.quadrants[3].details} tasks={quadrants.q4} onTaskComplete={onTaskComplete} onTaskDelete={onTaskDelete} onTaskUpdate={onTaskUpdate} color="border-t-gray-500" />
                    </div>
                ) : (
                    <div className="bg-light-card dark:bg-dark-card p-4 rounded-lg shadow-sm border border-light-border dark:border-dark-border space-y-3">
                         {allIncompleteTasks.length > 0 ? allIncompleteTasks.map(task => <TaskItem key={task.id} task={task} onToggle={() => onTaskComplete(task.id)} onDelete={onTaskDelete} onUpdate={onTaskUpdate} />) : <p className="text-center text-gray-500 py-4">No active tasks.</p>}
                    </div>
                )}
            </div>
            
            {completedTasks.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold mb-3">Completed Tasks</h2>
                     <div className="bg-light-card dark:bg-dark-card p-4 rounded-lg shadow-sm border border-light-border dark:border-dark-border space-y-3">
                         {completedTasks.map(task => <TaskItem key={task.id} task={task} onToggle={() => onTaskComplete(task.id)} onDelete={onTaskDelete} onUpdate={onTaskUpdate} />)}
                    </div>
                </div>
            )}

             <Modal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)}>
                 <div className="p-2">
                    <h3 className="text-xl font-bold mb-2">{PRIORITY_MATRIX_INSTRUCTIONS.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{PRIORITY_MATRIX_INSTRUCTIONS.description}</p>
                    <div className="space-y-3 text-sm">
                        {PRIORITY_MATRIX_INSTRUCTIONS.quadrants.map(q => <div key={q.name}><strong>{q.name}:</strong> {q.details}</div>)}
                    </div>
                 </div>
             </Modal>
        </div>
    );
};

export default Tasks;
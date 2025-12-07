import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { Task } from '../../types';
import { Plus, CheckCircle, Clock, MoreVertical, Filter, List, Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, User as UserIcon, Edit2, Trash2 } from 'lucide-react';
import Button from '../../components/Button';

const PortalTasks: React.FC = () => {
  const { user, teamMembers } = useAuth();
  const { tasks, addTask, toggleTaskStatus, updateTask, deleteTask } = useTasks();
  
  // Date Logic
  const today = new Date();
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  
  // Local UI State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDateForModal, setSelectedDateForModal] = useState<string | null>(null);
  
  // Task Form State
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    assignedTo: 'all',
    dueDate: new Date().toISOString().split('T')[0]
  });
  
  // Filter State
  const [showFilters, setShowFilters] = useState(false);
  const [onlyMyTasks, setOnlyMyTasks] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    assignedTo: 'all'
  });

  // --- Filtering Logic ---
  const filteredTasks = tasks.filter(task => {
    if (onlyMyTasks) {
       if (task.assignedTo !== user?.id) return false;
    }
    if (filters.status !== 'all') {
      if (filters.status === 'pending' && task.status === 'completed') return false;
      if (filters.status === 'completed' && task.status !== 'completed') return false;
      if (filters.status === 'in_progress' && task.status !== 'in_progress') return false;
    }
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
    if (filters.assignedTo !== 'all' && task.assignedTo !== filters.assignedTo) return false;
    if (user?.role === 'sdr' && task.assignedTo !== user.id && task.assignedTo !== 'all') return false;
    return true;
  });

  // --- Modal Handlers ---
  const openCreateModal = () => {
      setEditingTaskId(null);
      setTaskFormData({
        title: '',
        description: '',
        priority: 'medium',
        assignedTo: 'all',
        dueDate: new Date().toISOString().split('T')[0]
      });
      setShowTaskModal(true);
  };

  const openEditModal = (task: Task) => {
      setEditingTaskId(task.id);
      setTaskFormData({
          title: task.title,
          description: task.description,
          priority: task.priority,
          assignedTo: task.assignedTo,
          dueDate: task.dueDate
      });
      setShowTaskModal(true);
  };

  const handleSaveTask = () => {
    if (!taskFormData.title) return;
    
    const assigned = user?.role === 'sdr' ? user.id : taskFormData.assignedTo;

    if (editingTaskId) {
        // Update Logic
        const existingTask = tasks.find(t => t.id === editingTaskId);
        if (existingTask) {
            updateTask({
                ...existingTask,
                title: taskFormData.title,
                description: taskFormData.description,
                assignedTo: assigned,
                priority: taskFormData.priority,
                dueDate: taskFormData.dueDate
            });
        }
    } else {
        // Create Logic
        addTask({
            title: taskFormData.title,
            description: taskFormData.description,
            assignedTo: assigned,
            status: 'pending',
            priority: taskFormData.priority,
            dueDate: taskFormData.dueDate
        });
    }
    
    setShowTaskModal(false);
  };

  const handleDeleteTask = () => {
      if (editingTaskId) {
          if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
              deleteTask(editingTaskId);
              setShowTaskModal(false);
          }
      }
  };

  // --- Calendar Logic ---
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(calendarDate.setMonth(calendarDate.getMonth() + offset));
    setCalendarDate(new Date(newDate));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(calendarDate);
    const firstDay = getFirstDayOfMonth(calendarDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 bg-gray-50/50 border border-gray-100"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayTasks = filteredTasks.filter(t => t.dueDate === dateString);
      const isToday = new Date().toISOString().split('T')[0] === dateString;
      const hasHighPriority = dayTasks.some(t => t.priority === 'high');
      const hasMediumPriority = dayTasks.some(t => t.priority === 'medium');

      days.push(
        <div 
          key={day} 
          onClick={() => setSelectedDateForModal(dateString)}
          className={`h-32 border border-gray-100 p-2 overflow-y-auto hover:bg-gray-50 transition-colors relative cursor-pointer ${isToday ? 'bg-blue-50/30' : 'bg-white'}`}
        >
          <div className="flex justify-between items-start mb-1">
            <span className={`text-sm font-medium ${isToday ? 'bg-itaca-light text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-gray-700'}`}>
              {day}
            </span>
            <div className="flex gap-1">
               {hasHighPriority && <div className="w-2.5 h-2.5 rounded-full bg-red-500 border border-white shadow-sm" title="Tarefa de Alta Prioridade"></div>}
               {hasMediumPriority && <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 border border-white shadow-sm" title="Tarefa de Média Prioridade"></div>}
            </div>
          </div>
          
          <div className="space-y-1">
            {dayTasks.map(task => (
              <div 
                key={task.id} 
                className={`text-xs p-1.5 rounded truncate border-l-2 transition-all ${
                  task.status === 'completed' 
                    ? 'bg-gray-100 text-gray-400 border-gray-300 line-through' 
                    : task.priority === 'high' 
                      ? 'bg-red-50 text-red-700 border-red-500 font-medium'
                      : 'bg-blue-50 text-blue-700 border-blue-500'
                }`}
                title={task.title}
              >
                {task.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="relative">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tarefas</h1>
          <p className="text-gray-500">Gerencie suas atividades diárias e prioridades.</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full xl:w-auto items-center">
           {/* View Toggle */}
           <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-white text-itaca-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <List className="w-4 h-4" /> Lista
              </button>
              <button 
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${viewMode === 'calendar' ? 'bg-white text-itaca-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <CalendarIcon className="w-4 h-4" /> Calendário
              </button>
           </div>

           <div className="h-6 w-px bg-gray-300 mx-1 hidden sm:block"></div>

           {/* My Tasks Quick Filter */}
           <button 
             onClick={() => setOnlyMyTasks(!onlyMyTasks)}
             className={`flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
               onlyMyTasks 
               ? 'bg-itaca-light text-white border-itaca-light' 
               : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
             }`}
             title="Ver apenas tarefas atribuídas a mim"
           >
             <UserIcon className="w-4 h-4 mr-2" />
             Minhas
           </button>

           {/* Filter Button */}
           <div className="relative">
             <div className="group relative">
               <button 
                 onClick={() => setShowFilters(!showFilters)}
                 className={`flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                   showFilters || Object.values(filters).some(v => v !== 'all') 
                   ? 'bg-itaca-light text-white border-itaca-light' 
                   : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                 }`}
               >
                 <Filter className="w-4 h-4 mr-2" /> 
                 Filtrar
                 {Object.values(filters).some(v => v !== 'all') && <div className="ml-2 w-2 h-2 bg-white rounded-full"></div>}
               </button>
             </div>

             {/* Filter Dropdown */}
             {showFilters && (
               <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-20 animate-fade-in">
                 <div className="flex justify-between items-center mb-3">
                   <h3 className="font-bold text-gray-900 text-sm">Filtros Ativos</h3>
                   <button onClick={() => setShowFilters(false)}><X className="w-4 h-4 text-gray-400" /></button>
                 </div>
                 
                 <div className="space-y-3">
                   <div>
                     <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
                     <select 
                       className="w-full text-sm border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-itaca-light"
                       value={filters.status}
                       onChange={(e) => setFilters({...filters, status: e.target.value})}
                     >
                       <option value="all">Todos</option>
                       <option value="pending">Pendentes</option>
                       <option value="in_progress">Em Progresso</option>
                       <option value="completed">Concluídos</option>
                     </select>
                   </div>

                   <div>
                     <label className="block text-xs font-semibold text-gray-500 mb-1">Prioridade</label>
                     <select 
                       className="w-full text-sm border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-itaca-light"
                       value={filters.priority}
                       onChange={(e) => setFilters({...filters, priority: e.target.value})}
                     >
                       <option value="all">Todas</option>
                       <option value="high">Alta</option>
                       <option value="medium">Média</option>
                       <option value="low">Baixa</option>
                     </select>
                   </div>

                   {user?.role === 'admin' && (
                     <div>
                       <label className="block text-xs font-semibold text-gray-500 mb-1">Responsável</label>
                       <select 
                         className="w-full text-sm border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-itaca-light"
                         value={filters.assignedTo}
                         onChange={(e) => setFilters({...filters, assignedTo: e.target.value})}
                       >
                         <option value="all">Todos</option>
                         {teamMembers.map(member => (
                           <option key={member.id} value={member.id}>{member.name}</option>
                         ))}
                       </select>
                     </div>
                   )}
                   
                   <div className="pt-2">
                      <Button 
                        variant="white" 
                        fullWidth 
                        className="text-xs py-2 border border-gray-200"
                        onClick={() => setFilters({status: 'all', priority: 'all', assignedTo: 'all'})}
                      >
                        Limpar Filtros
                      </Button>
                   </div>
                 </div>
               </div>
             )}
           </div>
           
           {/* Add Task Button */}
           {user?.role === 'admin' && (
             <Button variant="primary" className="py-2 text-sm" onClick={openCreateModal}>
               <Plus className="w-4 h-4 mr-2" /> Nova Tarefa
             </Button>
           )}
        </div>
      </div>

      {/* Task Form Modal (Create/Edit) */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowTaskModal(false)}></div>
          <div className="relative bg-white p-6 rounded-xl border border-gray-200 shadow-lg animate-fade-in w-full max-w-lg">
            <div className="flex justify-between items-start mb-4">
               <h3 className="font-bold text-gray-900">{editingTaskId ? 'Editar Tarefa' : 'Nova Tarefa'}</h3>
               <button onClick={() => setShowTaskModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Título</label>
                    <input 
                      type="text" 
                      value={taskFormData.title}
                      onChange={(e) => setTaskFormData({...taskFormData, title: e.target.value})}
                      placeholder="O que precisa ser feito?"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itaca-light outline-none"
                      autoFocus
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Descrição</label>
                    <textarea 
                      value={taskFormData.description}
                      onChange={(e) => setTaskFormData({...taskFormData, description: e.target.value})}
                      placeholder="Detalhes adicionais..."
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itaca-light outline-none resize-none"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Data de Vencimento</label>
                        <input 
                          type="date"
                          value={taskFormData.dueDate}
                          onChange={(e) => setTaskFormData({...taskFormData, dueDate: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itaca-light outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Prioridade</label>
                        <select 
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itaca-light outline-none bg-white"
                          value={taskFormData.priority}
                          onChange={(e) => setTaskFormData({...taskFormData, priority: e.target.value as any})}
                        >
                          <option value="low">Baixa</option>
                          <option value="medium">Média</option>
                          <option value="high">Alta</option>
                        </select>
                    </div>

                    {user?.role === 'admin' && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Responsável</label>
                            <select 
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itaca-light outline-none bg-white"
                              value={taskFormData.assignedTo}
                              onChange={(e) => setTaskFormData({...taskFormData, assignedTo: e.target.value})}
                            >
                              <option value="all">Todos</option>
                              {teamMembers.map(member => (
                                <option key={member.id} value={member.id}>{member.name}</option>
                              ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              {editingTaskId && (
                  <Button variant="white" className="py-2 px-4 text-sm text-red-500 border-red-200 hover:bg-red-50 mr-auto" onClick={handleDeleteTask}>
                      <Trash2 className="w-4 h-4 mr-2" /> Excluir
                  </Button>
              )}
              <Button variant="white" className="py-2 px-4 text-sm" onClick={() => setShowTaskModal(false)}>Cancelar</Button>
              <Button variant="primary" className="py-2 px-4 text-sm" onClick={handleSaveTask}>{editingTaskId ? 'Salvar Alterações' : 'Criar Tarefa'}</Button>
            </div>
          </div>
        </div>
      )}

      {/* Day Details Modal */}
      {selectedDateForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedDateForModal(null)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Tarefas de {selectedDateForModal.split('-').reverse().join('/')}
                </h3>
                <button onClick={() => setSelectedDateForModal(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
             </div>
             
             <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {filteredTasks.filter(t => t.dueDate === selectedDateForModal).length === 0 ? (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-100 rounded-lg">
                    <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>Nenhuma tarefa agendada para este dia.</p>
                  </div>
                ) : (
                  filteredTasks.filter(t => t.dueDate === selectedDateForModal).map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                       <button 
                         onClick={() => toggleTaskStatus(task.id)}
                         className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                           task.status === 'completed' 
                             ? 'bg-green-500 border-green-500 text-white' 
                             : 'border-gray-300 text-transparent hover:border-itaca-light'
                         }`}
                       >
                          <CheckCircle className="w-4 h-4" />
                       </button>
                       <div className="flex-1 cursor-pointer" onClick={() => { setSelectedDateForModal(null); openEditModal(task); }}>
                         <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                            {task.title}
                         </p>
                         <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                               task.priority === 'high' ? 'bg-red-50 text-red-600' : 
                               task.priority === 'medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'
                            }`}>
                              {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                            </span>
                            <span className="text-[10px] text-gray-400">
                               {task.assignedTo === '1' ? 'Admin' : 'SDR'}
                            </span>
                         </div>
                       </div>
                    </div>
                  ))
                )}
             </div>
             
             <div className="mt-6 flex justify-end">
                <Button variant="primary" fullWidth onClick={() => setSelectedDateForModal(null)}>Fechar</Button>
             </div>
          </div>
        </div>
      )}

      {viewMode === 'list' ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in">
          <div className="divide-y divide-gray-100">
            {filteredTasks.length === 0 ? (
               <div className="p-12 text-center text-gray-500">
                 Nenhuma tarefa encontrada com os filtros atuais.
               </div>
            ) : (
              filteredTasks.map((task) => (
                <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4 group">
                  <button 
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.status === 'completed' 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 text-transparent hover:border-itaca-light'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openEditModal(task)}>
                    <p className={`font-medium text-sm truncate ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </p>
                    {task.description && (
                        <p className="text-xs text-gray-500 truncate mt-0.5">{task.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        task.priority === 'high' ? 'bg-red-50 text-red-600' : 
                        task.priority === 'medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                      </span>
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="w-3 h-3 mr-1" /> {task.dueDate}
                      </div>
                      {user?.role === 'admin' && (
                        <span className="text-xs text-gray-400">
                          {task.assignedTo === 'all' ? 'Todos' : teamMembers.find(m => m.id === task.assignedTo)?.name || 'Usuário'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(task)} className="p-2 hover:bg-gray-200 rounded-full text-gray-400">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6 animate-fade-in">
          {/* Calendar Header */}
          <div className="flex justify-between items-center mb-6">
             <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                <ChevronLeft className="w-5 h-5" />
             </button>
             <h2 className="text-lg font-bold text-gray-900 capitalize">
                {monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}
             </h2>
             <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                <ChevronRight className="w-5 h-5" />
             </button>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-px mb-2">
             {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
               <div key={day} className="text-center text-xs font-semibold text-gray-500 uppercase py-2">
                 {day}
               </div>
             ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
             {renderCalendar()}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortalTasks;
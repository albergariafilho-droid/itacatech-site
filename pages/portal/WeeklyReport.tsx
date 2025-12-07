import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useAppointments } from '../../context/AppointmentContext';
import { BarChart, CheckCircle, Calendar, TrendingUp, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const WeeklyReport: React.FC = () => {
  const { tasks } = useTasks();
  const { appointments } = useAppointments();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Helper to determine if a date is in the current week (Simple approximation for demo)
  const isThisWeek = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 7;
  };

  // Task Stats
  const tasksThisWeek = tasks.filter(t => isThisWeek(t.dueDate));
  const completedTasks = tasksThisWeek.filter(t => t.status === 'completed').length;
  // const pendingTasks = tasksThisWeek.filter(t => t.status !== 'completed').length;
  const completionRate = tasksThisWeek.length > 0 ? Math.round((completedTasks / tasksThisWeek.length) * 100) : 0;
  const highPriorityCompleted = tasksThisWeek.filter(t => t.status === 'completed' && t.priority === 'high').length;

  // Appointment Stats
  const appointmentsThisWeek = appointments.filter(a => isThisWeek(a.date));
  const newAppointmentsCount = appointmentsThisWeek.length;

  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const CardDetails = ({ title, details, date }: { title: string, details: string, date: string }) => (
    <div className="mt-4 pt-4 border-t border-gray-100 text-sm animate-fade-in">
        <p className="font-semibold text-gray-700 mb-1">{title}</p>
        <p className="text-gray-500 mb-2">{details}</p>
        <p className="text-xs text-gray-400 italic">Atualizado em: {date}</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-itaca-dark rounded-xl text-white">
          <BarChart className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatório Semanal</h1>
          <p className="text-gray-500">Resumo de produtividade e atividades dos últimos 7 dias.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Task Completion */}
        <div 
            className={`bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${expandedCard === 'completion' ? 'ring-2 ring-itaca-light' : ''}`}
            onClick={() => toggleCard('completion')}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Taxa de Conclusão</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{completionRate}%</h3>
            </div>
            <div className={`p-2 rounded-lg ${completionRate >= 80 ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-itaca-light h-2 rounded-full transition-all duration-1000" style={{ width: `${completionRate}%` }}></div>
          </div>
          <div className="flex justify-between items-center mt-3">
             <p className="text-xs text-gray-400">{completedTasks} de {tasksThisWeek.length} tarefas finalizadas nesta semana.</p>
             {expandedCard === 'completion' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </div>
          
          {expandedCard === 'completion' && (
              <CardDetails 
                title="Análise de Produtividade"
                details="A taxa de conclusão está acima da média das últimas 4 semanas. Continue mantendo o ritmo para atingir as metas mensais."
                date={new Date().toLocaleDateString()}
              />
          )}
        </div>

        {/* Card 2: High Priority Focus */}
        <div 
            className={`bg-white p-6 rounded-xl border border-gray-200 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${expandedCard === 'priority' ? 'ring-2 ring-itaca-light' : ''}`}
            onClick={() => toggleCard('priority')}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Foco Prioritário</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{highPriorityCompleted}</h3>
            </div>
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-gray-600">Tarefas de <span className="font-bold text-red-500">Alta Prioridade</span> concluídas.</p>
          <div className="flex justify-between items-center mt-3">
             <p className="text-xs text-gray-400">Mantenha o foco no que gera mais impacto.</p>
             {expandedCard === 'priority' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </div>

          {expandedCard === 'priority' && (
              <CardDetails 
                title="Detalhamento de Prioridades"
                details="Focar em tarefas de alta prioridade garante que os objetivos estratégicos sejam alcançados mais rapidamente. Ótimo trabalho na triagem."
                date={new Date().toLocaleDateString()}
              />
          )}
        </div>

        {/* Card 3: New Meetings */}
        <div 
            className={`bg-white p-6 rounded-xl border border-gray-200 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${expandedCard === 'meetings' ? 'ring-2 ring-itaca-light' : ''}`}
            onClick={() => toggleCard('meetings')}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Novas Reuniões</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{newAppointmentsCount}</h3>
            </div>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-gray-600">Agendamentos criados nos últimos 7 dias.</p>
          <div className="flex justify-between items-center mt-3">
             <p className="text-xs text-gray-400">O pipeline está em movimento.</p>
             {expandedCard === 'meetings' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </div>

          {expandedCard === 'meetings' && (
              <CardDetails 
                title="Volume de Agendamentos"
                details="Este indicador reflete a eficácia das campanhas de prospecção recentes. Um aumento aqui geralmente precede um aumento em fechamentos."
                date={new Date().toLocaleDateString()}
              />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Completed Tasks List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Tarefas Concluídas Recentemente</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {tasksThisWeek.filter(t => t.status === 'completed').length === 0 ? (
               <p className="p-6 text-gray-500 text-center text-sm">Nenhuma tarefa concluída nesta semana.</p>
            ) : (
              tasksThisWeek.filter(t => t.status === 'completed').map(task => (
                <div key={task.id} className="p-4 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 line-through text-opacity-75">{task.title}</p>
                    <p className="text-xs text-gray-500">Data: {task.dueDate}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Meetings List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Próximas Reuniões (Semana)</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {appointmentsThisWeek.length === 0 ? (
               <p className="p-6 text-gray-500 text-center text-sm">Nenhuma reunião agendada para esta semana.</p>
            ) : (
              appointmentsThisWeek.map(apt => (
                <div key={apt.id} className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600 font-bold text-xs flex flex-col items-center min-w-[50px]">
                    <span>{apt.date.split('-')[2]}</span>
                    <span className="text-[10px] uppercase">{new Date(apt.date).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{apt.clientName}</p>
                    <p className="text-xs text-gray-500">{apt.time} - {apt.clientEmail}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;
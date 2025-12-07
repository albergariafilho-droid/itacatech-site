import React, { useState } from 'react';
import { useAppointments } from '../../context/AppointmentContext';
import { useAlerts } from '../../context/AlertContext';
import { Calendar as CalendarIcon, Clock, Mail, User, Plus, X, Edit2, Trash2 } from 'lucide-react';
import Button from '../../components/Button';
import { Appointment } from '../../types';

const PortalSchedule: React.FC = () => {
  const { appointments, addAppointment, updateAppointment, deleteAppointment } = useAppointments();
  const { addAlert } = useAlerts();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAptId, setEditingAptId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    date: '',
    time: '',
    notes: ''
  });

  const openCreateModal = () => {
      setEditingAptId(null);
      setFormData({ clientName: '', clientEmail: '', date: '', time: '', notes: '' });
      setIsModalOpen(true);
  };

  const openEditModal = (apt: Appointment) => {
      setEditingAptId(apt.id);
      setFormData({
          clientName: apt.clientName,
          clientEmail: apt.clientEmail,
          date: apt.date,
          time: apt.time,
          notes: apt.notes || ''
      });
      setIsModalOpen(true);
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAptId) {
        // Update Logic
        updateAppointment(editingAptId, {
            ...formData,
        });
    } else {
        // Create Logic
        addAppointment({
          ...formData,
        });

        // Add Alert for Employees only on new creation
        addAlert({
          type: 'info',
          message: `Nova reunião agendada: ${formData.clientName} em ${formData.date} às ${formData.time}.`,
        });
    }

    setIsModalOpen(false);
  };

  const handleDelete = () => {
      if (editingAptId) {
          if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
              deleteAppointment(editingAptId);
              setIsModalOpen(false);
          }
      }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agenda de Reuniões</h1>
          <p className="text-gray-500">Visualize todas as reuniões agendadas.</p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" /> Novo Agendamento
        </Button>
      </div>

      {/* Internal Booking/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fade-in">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-gray-900">{editingAptId ? 'Editar Agendamento' : 'Agendar Reunião Internamente'}</h3>
               <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
             </div>
             
             <form onSubmit={handleSaveSchedule} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                     <input required type="date" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-itaca-light outline-none"
                       value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                     <input required type="time" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-itaca-light outline-none"
                       value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cliente</label>
                   <input required type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-itaca-light outline-none"
                     value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Email do Cliente</label>
                   <input required type="email" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-itaca-light outline-none"
                     value={formData.clientEmail} onChange={e => setFormData({...formData, clientEmail: e.target.value})} />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                   <textarea className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-itaca-light outline-none" rows={2}
                     value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                </div>
                
                <div className="pt-2 flex gap-3">
                   {editingAptId && (
                       <Button type="button" variant="white" className="text-red-500 border-red-200 hover:bg-red-50 mr-auto" onClick={handleDelete}>
                           <Trash2 className="w-4 h-4 mr-2" /> Excluir
                       </Button>
                   )}
                   <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                   <Button type="submit" variant="primary">{editingAptId ? 'Salvar Alterações' : 'Confirmar'}</Button>
                </div>
             </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.length === 0 ? (
          <div className="col-span-3 text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
             <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
             <p className="text-gray-500 font-medium">Nenhum agendamento encontrado.</p>
          </div>
        ) : (
          appointments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all group relative">
              
              <button 
                onClick={() => openEditModal(apt)}
                className="absolute top-4 right-4 text-gray-400 hover:text-itaca-light opacity-0 group-hover:opacity-100 transition-opacity p-1"
                title="Editar"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <div className="flex justify-between items-start mb-4 pr-6">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-itaca-dark">{apt.date.split('-').reverse().join('/')}</span>
                  <span className="text-sm text-gray-500 flex items-center mt-1">
                    <Clock className="w-3 h-3 mr-1" /> {apt.time}
                  </span>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  apt.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {apt.status === 'scheduled' ? 'Agendado' : apt.status}
                </span>
              </div>
              
              <div className="border-t border-gray-100 my-4"></div>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-700">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium">{apt.clientName}</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{apt.clientEmail}</span>
                </div>
                {apt.notes && (
                  <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 mt-2 italic">
                    "{apt.notes}"
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PortalSchedule;
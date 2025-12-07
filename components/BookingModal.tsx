import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      // Carregar script do Calendly dinamicamente quando o modal abrir
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // Limpeza opcional se necessário
        if(document.body.contains(script)){
            document.body.removeChild(script);
        }
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden animate-fade-in flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg">Agendar Consultoria Gratuita</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-6 h-6" />
            </button>
        </div>

        <div className="flex-1 bg-gray-50 overflow-y-auto">
            {/* Widget do Calendly */}
            <div 
                className="calendly-inline-widget w-full h-full" 
                data-url="https://calendly.com/albergariafilho?hide_landing_page_details=1&hide_gdpr_banner=1" 
                style={{ minWidth: '320px', height: '100%' }} 
            />
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
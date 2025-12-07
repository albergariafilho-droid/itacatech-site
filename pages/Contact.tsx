import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Calendar, CheckCircle } from 'lucide-react';
import Button from '../components/Button';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({
    email: '',
    phone: ''
  });

  const [submitted, setSubmitted] = useState(false);

  // Carregar script do Calendly
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if(document.body.contains(script)){
        document.body.removeChild(script);
      }
    };
  }, []);

  const validateEmail = (email: string) => {
    if (!email) return '';
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email) ? '' : 'Por favor, insira um e-mail válido.';
  };

  const validatePhone = (phone: string) => {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10 ? '' : 'Telefone inválido (mínimo 10 dígitos)';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'email') {
      setErrors(prev => ({ ...prev, email: validateEmail(value) }));
    }
    if (name === 'phone') {
      setErrors(prev => ({ ...prev, phone: validatePhone(value) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation check before submit
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhone(formData.phone);
    
    if (emailError || phoneError || !formData.email || !formData.phone) {
      setErrors({
        email: emailError || (formData.email ? '' : 'Campo obrigatório'),
        phone: phoneError || (formData.phone ? '' : 'Campo obrigatório')
      });
      return;
    }

    // Simulate form submission
    setTimeout(() => setSubmitted(true), 1000);
  };

  return (
    <div className="bg-white">
      <div className="bg-itaca-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Vamos conversar?</h1>
          <p className="text-xl text-gray-300">
            Descubra como podemos acelerar suas vendas ainda hoje.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-itaca-dark mb-6">Fale com um especialista</h2>
            <p className="text-gray-600 mb-10 leading-relaxed">
              Preencha o formulário ou entre em contato diretamente pelos nossos canais. Nosso time responderá em até 2 horas úteis.
            </p>

            <div className="space-y-8 mb-12">
              <div className="flex items-start">
                <div className="bg-blue-50 p-3 rounded-lg mr-4">
                  <Phone className="w-6 h-6 text-itaca-dark" />
                </div>
                <div>
                  <h3 className="font-semibold text-itaca-dark">WhatsApp / Telefone</h3>
                  <p className="text-gray-600">(73) 92000-8424</p>
                  <a 
                    href="https://wa.me/5573920008424" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-itaca-light hover:underline"
                  >
                    Chamar no WhatsApp
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-50 p-3 rounded-lg mr-4">
                  <Mail className="w-6 h-6 text-itaca-dark" />
                </div>
                <div>
                  <h3 className="font-semibold text-itaca-dark">E-mail</h3>
                  <p className="text-gray-600">contato@itacare.tech</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-50 p-3 rounded-lg mr-4">
                  <MapPin className="w-6 h-6 text-itaca-dark" />
                </div>
                <div>
                  <h3 className="font-semibold text-itaca-dark">Sede</h3>
                  <p className="text-gray-600">Itacaré, Bahia - Brasil</p>
                </div>
              </div>
            </div>

            {/* Calendly Integration */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden h-[600px] flex flex-col">
               <div className="p-4 bg-gray-50 border-b border-gray-100 flex-shrink-0">
                  <h3 className="font-semibold text-itaca-dark flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-itaca-light" />
                      Agende sua reunião diretamente
                  </h3>
               </div>
               <div className="flex-grow relative">
                   <div 
                     className="calendly-inline-widget w-full h-full" 
                     data-url="https://calendly.com/albergariafilho?hide_landing_page_details=1&hide_gdpr_banner=1" 
                     style={{ minWidth: '320px', height: '100%' }} 
                   />
               </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 h-fit">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Mensagem enviada!</h3>
                <p className="text-gray-600">
                  Obrigado pelo interesse. Em breve entraremos em contato.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-itaca-light font-medium hover:text-itaca-dark"
                >
                  Enviar nova mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-itaca-light focus:border-transparent outline-none transition-all"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-itaca-light focus:border-transparent outline-none transition-all"
                    placeholder="Nome da sua empresa"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail Corporativo</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-itaca-light focus:border-transparent outline-none transition-all`}
                      placeholder="voce@empresa.com"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-itaca-light focus:border-transparent outline-none transition-all`}
                      placeholder="(DD) 99999-9999"
                    />
                     {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Como podemos ajudar?</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-itaca-light focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Descreva brevemente seu desafio atual..."
                  ></textarea>
                </div>

                <Button type="submit" fullWidth variant="primary" className="py-4 text-lg">
                  Solicitar Contato
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
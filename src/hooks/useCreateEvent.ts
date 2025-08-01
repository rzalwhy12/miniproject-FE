'use client';
import { useState } from 'react';
import { EventForm, Ticket, Voucher } from '@/types/event';

export const useCreateEvent = () => {
  const [form, setForm] = useState<EventForm>({
    name: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    statusEvent: 'PUBLISHED',
    category: 'CONFERENCE',
    syaratKetentuan: '',
    image: null,
    vouchers: []
  });

  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 1, name: 'Regular', price: '200000', description: 'Regular ticket' }
  ]);

  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, files } = e.target as any;
    if (name === 'image') {
      const file = files[0];
      if (file) {
        // Check file size (10MB limit)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
          setMessage('Ukuran file terlalu besar. Maksimal 10MB.');
          return;
        }
        // Check file type
        const allowedTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp'
        ];
        if (!allowedTypes.includes(file.type)) {
          setMessage(
            'Format file tidak didukung. Gunakan JPG, PNG, atau WebP.'
          );
          return;
        }
        console.log('Image selected:', {
          name: file.name,
          type: file.type,
          size: (file.size / 1024 / 1024).toFixed(2) + 'MB'
        });
        setMessage('');
      }
      setForm((prev) => ({ ...prev, image: file }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTicketChange = (id: number, field: string, value: string) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === id ? { ...ticket, [field]: value } : ticket
      )
    );
  };

  const addTicket = () => {
    const newId = Math.max(...tickets.map((t) => t.id)) + 1;
    setTickets([
      ...tickets,
      { id: newId, name: '', price: '', description: '' }
    ]);
  };

  const removeTicket = (id: number) => {
    setTickets(tickets.filter((ticket) => ticket.id !== id));
  };

  // Voucher handlers
  const addVoucher = () => {
    setVouchers([...vouchers, { discount: 0, startDate: '', endDate: '' }]);
  };

  const handleVoucherChange = (
    idx: number,
    field: keyof Voucher,
    value: string | number
  ) => {
    setVouchers(
      vouchers.map((v, i) => (i === idx ? { ...v, [field]: value } : v))
    );
  };

  const removeVoucher = (idx: number) => {
    setVouchers(vouchers.filter((_, i) => i !== idx));
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      statusEvent: 'PUBLISHED',
      category: 'CONFERENCE',
      syaratKetentuan: '',
      image: null,
      vouchers: []
    });
    setTickets([
      { id: 1, name: 'Regular', price: '200000', description: 'Regular ticket' }
    ]);
    setVouchers([]);
  };

  return {
    form,
    tickets,
    vouchers,
    loading,
    message,
    setLoading,
    setMessage,
    handleChange,
    handleTicketChange,
    handleVoucherChange,
    addVoucher,
    removeVoucher,
    addTicket,
    removeTicket,
    resetForm
  };
};

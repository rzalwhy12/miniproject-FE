'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import {
  addEditTicket,
  removeEditTicket,
  updateEditTicket
} from '@/lib/redux/features/editEventSlice';

const TicketSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tickets } = useAppSelector((state) => state.editEvent);

  const handleAddTicket = () => {
    const newTicket = {
      id: Date.now(), // unique ID
      name: '',
      price: 0,
      quota: 0,
      descriptionTicket: '',
      benefit: ''
    };
    dispatch(addEditTicket(newTicket));
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
      <CardContent className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Ticket Categories
            </h3>
          </div>
          <Button
            type="button"
            onClick={handleAddTicket}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Ticket
          </Button>
        </div>

        {/* Ticket List */}
        {tickets.map((ticket, index) => (
          <div key={ticket.id} className="relative mb-6 last:mb-0">
            <div className="bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:border-purple-300 transition-all duration-300 shadow-sm">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                {index + 1}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <InputField
                  label="Ticket Name"
                  placeholder="e.g., VIP Access"
                  value={ticket.name}
                  onChange={(value) =>
                    dispatch(
                      updateEditTicket({ id: ticket.id, field: 'name', value })
                    )
                  }
                />
                <InputField
                  label="Price (IDR)"
                  type="number"
                  placeholder="200000"
                  value={ticket.price}
                  onChange={(value) =>
                    dispatch(
                      updateEditTicket({
                        id: ticket.id,
                        field: 'price',
                        value: +value
                      })
                    )
                  }
                />
                <InputField
                  label="Quota"
                  type="number"
                  placeholder="50"
                  value={ticket.quota}
                  onChange={(value) =>
                    dispatch(
                      updateEditTicket({
                        id: ticket.id,
                        field: 'quota',
                        value: +value
                      })
                    )
                  }
                />
                <div className="flex items-end">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => dispatch(removeEditTicket(ticket.id))}
                    className="w-full bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>

              <InputField
                label="Description"
                placeholder="Describe what's included with this ticket"
                value={ticket.descriptionTicket}
                onChange={(value) =>
                  dispatch(
                    updateEditTicket({
                      id: ticket.id,
                      field: 'descriptionTicket',
                      value
                    })
                  )
                }
                className="mt-4"
              />
              <InputField
                label="Benefit"
                placeholder="Enter benefit for this ticket"
                value={ticket.benefit}
                onChange={(value) =>
                  dispatch(
                    updateEditTicket({ id: ticket.id, field: 'benefit', value })
                  )
                }
                className="mt-4"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TicketSection;

// Reusable Input Field
interface InputFieldProps {
  label: string;
  placeholder?: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number';
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  className = ''
}) => (
  <div className={`space-y-2 ${className}`}>
    <Label className="text-sm text-gray-700 font-medium">{label}</Label>
    <Input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white/90 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20"
    />
  </div>
);

'use client';

import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Sparkles, Globe } from 'lucide-react';
import { categoryOptions } from '@/types/event';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { toast } from 'sonner';
import { updateEditEventField } from '@/lib/redux/features/editEventSlice';

const toDatetimeLocal = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toISOString().slice(0, 16);
};

const EventBasicInfo = () => {
  const dispatch = useAppDispatch();
  const { name, startDate, endDate, location, category } = useAppSelector(
    (state) => state.editEvent
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    dispatch(updateEditEventField({ field: name as any, value }));
  };

  useEffect(() => {
    if (startDate && endDate && endDate < startDate) {
      toast.warning('End date must be after start date');
    }
  }, [startDate, endDate]);

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Event Name */}
      <div className="relative">
        <Input
          type="text"
          name="name"
          placeholder="Event Name"
          value={name}
          onChange={handleChange}
          required
          className="text-2xl md:text-4xl lg:text-5xl font-bold 
            border-none p-0 h-auto bg-transparent 
            placeholder:text-gray-500 text-gray-800 
            focus:ring-0 focus:border-none"
        />
        <div className="flex items-center mt-2 text-gray-600">
          <Globe className="w-4 h-4 mr-2" />
          <p className="text-sm">By Event Organizer</p>
        </div>
      </div>

      {/* Start & End Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        <div className="space-y-2">
          <Label className="text-sm text-gray-700 flex items-center font-medium">
            <Calendar className="w-4 h-4 mr-2" />
            Start Date & Time
          </Label>
          <Input
            type="datetime-local"
            name="startDate"
            value={toDatetimeLocal(startDate)}
            onChange={handleChange}
            required
            className="bg-white/80 border-gray-300 text-gray-800 
              focus:border-purple-500 focus:ring-purple-500/20"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-gray-700 flex items-center font-medium">
            <Calendar className="w-4 h-4 mr-2" />
            End Date & Time
          </Label>
          <Input
            type="datetime-local"
            name="endDate"
            value={toDatetimeLocal(endDate)}
            onChange={handleChange}
            required
            className="bg-white/80 border-gray-300 text-gray-800 
              focus:border-purple-500 focus:ring-purple-500/20"
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label className="text-sm text-gray-700 flex items-center font-medium">
          <MapPin className="w-4 h-4 mr-2" />
          Event Location
        </Label>
        <Input
          type="text"
          name="location"
          placeholder="Enter complete event location"
          value={location}
          onChange={handleChange}
          required
          className="bg-white/80 border-gray-300 text-gray-800 
            placeholder:text-gray-500 
            focus:border-purple-500 focus:ring-purple-500/20"
        />
      </div>

      {/* Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        <div className="space-y-2">
          <Label className="text-sm text-gray-700 flex items-center font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            Category
          </Label>
          <select
            name="category"
            value={category}
            onChange={handleChange}
            required
            className="w-full h-10 px-3 py-2 bg-white/80 
              border border-gray-300 text-gray-800 rounded-md 
              focus:border-purple-500 focus:ring-purple-500/20 focus:ring-2"
          >
            <option value="" disabled>
              -- Select Category --
            </option>
            {categoryOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-white text-gray-800"
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default EventBasicInfo;

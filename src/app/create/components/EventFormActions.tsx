'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap } from 'lucide-react';

interface EventFormActionsProps {
  loading: boolean;
  message: string;
  onLaunch: (e: React.FormEvent) => void;
  onDraft: (e: React.MouseEvent) => void;
}

const EventFormActions: React.FC<EventFormActionsProps> = ({
  loading,
  message,
  onLaunch,
  onDraft
}) => {
  return (
    <>
      {/* Action Buttons */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 pt-8">
        <div className="flex items-center text-gray-600">
          <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
          <p className="text-sm">Ready to launch your extraordinary event?</p>
        </div>
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="bg-white/80 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-6 py-3"
            onClick={onDraft}
          >
            Save Draft
          </Button>
          <Button
            type="submit"
            disabled={loading}
            onClick={onLaunch}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg px-8 py-3 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Creating Event...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Launch Event
                </>
              )}
            </span>
          </Button>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`p-6 rounded-xl backdrop-blur-sm border shadow-lg ${
            message.includes('berhasil') || message.includes('success')
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          <div className="flex items-start">
            {message.includes('berhasil') || message.includes('success') ? (
              <Sparkles className="w-5 h-5 mr-3 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <Zap className="w-5 h-5 mr-3 text-red-600 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <span className="font-medium block">{message}</span>
              {message.includes('server berjalan') && (
                <span className="text-sm mt-1 block opacity-80">
                  Pastikan backend server sudah dijalankan dan dapat diakses.
                </span>
              )}
              {message.includes('login') && (
                <span className="text-sm mt-1 block opacity-80">
                  Silakan refresh halaman dan login kembali.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventFormActions;

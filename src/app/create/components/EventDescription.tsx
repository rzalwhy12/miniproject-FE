'use client';
import React from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Settings } from 'lucide-react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface EventDescriptionProps {
  description: string;
  syaratKetentuan: string;
  onDescriptionChange: (val: string) => void;
  onSyaratChange: (val: string) => void;
}

const EventDescription: React.FC<EventDescriptionProps> = ({
  description,
  syaratKetentuan,
  onDescriptionChange,
  onSyaratChange
}) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
      <CardContent className="p-4 sm:p-6 md:p-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-gray-800 flex items-center">
              <Edit className="w-5 h-5 mr-2" />
              Event Description
            </Label>
            <CKEditor
              editor={ClassicEditor as any}
              data={description}
              onChange={(_event, editor) => {
                const data = editor.getData();
                onDescriptionChange(data);
              }}
              config={{
                placeholder: 'Tell the world about your amazing event...'
              }}
            />
          </div>
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-gray-800 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Terms & Conditions
            </Label>
            <CKEditor
              editor={ClassicEditor as any}
              data={syaratKetentuan}
              onChange={(_event, editor) => {
                const data = editor.getData();
                onSyaratChange(data);
              }}
              config={{
                placeholder: 'Enter terms and conditions for your event...'
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventDescription;

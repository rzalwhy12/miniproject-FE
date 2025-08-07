'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { setEditEventForm } from '@/lib/redux/features/editEventSlice';

const EventDescription = () => {
  const dispatch = useAppDispatch();
  const { description, syaratKetentuan } = useAppSelector(
    (state) => state.editEvent
  );

  const handleDescriptionChange = (_: any, editor: any) => {
    const data = editor.getData();
    dispatch(
      setEditEventForm({
        description: data,
        syaratKetentuan
      })
    );
  };

  const handleSyaratChange = (_: any, editor: any) => {
    const data = editor.getData();
    dispatch(
      setEditEventForm({
        description,
        syaratKetentuan: data
      })
    );
  };

  return (
    <Card className="bg-white/80 shadow-lg border-gray-200">
      <CardContent className="space-y-6">
        {/* Deskripsi Event */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Event Description
          </Label>
          <CKEditor
            editor={ClassicEditor as any}
            data={description}
            onChange={handleDescriptionChange}
            config={{
              placeholder: 'Tell about your event...'
            }}
          />
        </div>

        {/* Syarat dan Ketentuan */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Terms & Conditions
          </Label>
          <CKEditor
            editor={ClassicEditor as any}
            data={syaratKetentuan}
            onChange={handleSyaratChange}
            config={{
              placeholder: 'Write the rules...'
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EventDescription;

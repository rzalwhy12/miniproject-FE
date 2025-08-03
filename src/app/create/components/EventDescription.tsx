'use client';
import React from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { createEventForm } from '@/lib/redux/features/createEvenSlice';

const EventDescription = () => {
  const dispatch = useAppDispatch();
  const { description, syaratKetentuan } = useAppSelector(
    (state) => state.createEvent
  );

  return (
    <Card>
      <CardContent className="space-y-6">
        <div>
          <Label>Event Description</Label>
          <CKEditor
            editor={ClassicEditor as any}
            data={description}
            onChange={(_, editor) =>
              dispatch(createEventForm({ description: editor.getData() }))
            }
            config={{ placeholder: 'Tell about your event...' }}
          />
        </div>
        <div>
          <Label>Terms & Conditions</Label>
          <CKEditor
            editor={ClassicEditor as any}
            data={syaratKetentuan}
            onChange={(_, editor) =>
              dispatch(createEventForm({ syaratKetentuan: editor.getData() }))
            }
            config={{ placeholder: 'Write the rules...' }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EventDescription;

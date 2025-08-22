'use client';
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { createEventForm } from '@/lib/redux/features/createEvenSlice';

const EventDescription = () => {
  const dispatch = useAppDispatch();
  const { description, syaratKetentuan } = useAppSelector(
    (state) => state.createEvent
  );

  const [CKEditorComp, setCKEditorComp] = useState<any>(null);
  const [Classic, setClassic] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const reactMod = await import('@ckeditor/ckeditor5-react');
        const classicMod = await import('@ckeditor/ckeditor5-build-classic');
        const CK = (reactMod as any).CKEditor;
        const Classic = (classicMod as any).default || (classicMod as any);
        if (mounted && CK && Classic) {
          setCKEditorComp(() => CK);
          setClassic(() => Classic);
        }
      } catch (e) {
        // ignore
      }
    };
    // Only load on client
    if (typeof window !== 'undefined') load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Card>
      <CardContent className="space-y-6">
        <div>
          <Label>Event Description</Label>
          {CKEditorComp && Classic ? (
            <CKEditorComp
              editor={Classic}
              data={description}
              onChange={(_: any, editor: any) =>
                dispatch(createEventForm({ description: editor.getData() }))
              }
              config={{ placeholder: 'Tell about your event...' }}
            />
          ) : (
            <div className="h-28 rounded-md border border-gray-200 bg-gray-50 animate-pulse" />
          )}
        </div>
        <div>
          <Label>Terms & Conditions</Label>
          {CKEditorComp && Classic ? (
            <CKEditorComp
              editor={Classic}
              data={syaratKetentuan}
              onChange={(_: any, editor: any) =>
                dispatch(createEventForm({ syaratKetentuan: editor.getData() }))
              }
              config={{ placeholder: 'Write the rules...' }}
            />
          ) : (
            <div className="h-28 rounded-md border border-gray-200 bg-gray-50 animate-pulse" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventDescription;

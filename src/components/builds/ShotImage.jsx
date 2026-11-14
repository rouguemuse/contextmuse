import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

export default function ShotImage({ fileUri }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    let alive = true;
    if (!fileUri) return undefined;

    // Check if it's already a direct data URL, blob URL, or web link
    if (fileUri.startsWith('data:') || fileUri.startsWith('blob:') || fileUri.startsWith('http')) {
      setUrl(fileUri);
      return undefined;
    }

    // Otherwise attempt Base44 signed URL fallback
    if (base44?.integrations?.Core?.CreateFileSignedUrl) {
      base44.integrations.Core.CreateFileSignedUrl({ file_uri: fileUri, expires_in: 3600 })
        .then((res) => {
          if (alive) setUrl(res.signed_url);
        })
        .catch(() => {
          if (alive) setUrl(null);
        });
    }

    return () => {
      alive = false;
    };
  }, [fileUri]);

  if (!url) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#2C3335] text-[#DFDACE]/60 p-2 text-center">
        <span className="font-mono text-[10px] uppercase tracking-wider">Reference Image</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt="Reference Shot"
      className="h-full w-full object-cover rounded pointer-events-none select-none"
    />
  );
}

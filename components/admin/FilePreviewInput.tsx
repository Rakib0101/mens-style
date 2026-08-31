"use client";

import { useEffect, useState } from "react";

export default function FilePreviewInput({
  name,
  multiple,
}: {
  name: string;
  multiple?: boolean;
}) {
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    previews.forEach((url) => URL.revokeObjectURL(url));
    const files = Array.from(e.target.files || []);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  }

  return (
    <div>
      <input
        type="file"
        name={name}
        accept="image/*"
        multiple={multiple}
        onChange={handleChange}
        className="text-sm"
      />
      {previews.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {previews.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt=""
              className="h-20 w-20 rounded-lg border border-surface-line object-cover"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

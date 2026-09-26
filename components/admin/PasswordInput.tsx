"use client";

import { useState } from "react";

export default function PasswordInput({
  name,
  autoComplete,
  required,
  className,
  placeholder,
}: {
  name: string;
  autoComplete?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        name={name}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`${className ?? ""} pr-10`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-ink/40 hover:text-ink/70"
      >
        {visible ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            className="h-4.5 w-4.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3l18 18M10.58 10.58a2 2 0 002.83 2.83M9.88 4.24A9.96 9.96 0 0112 4c5 0 9.27 3.11 11 7.5a11.6 11.6 0 01-2.44 3.77M6.6 6.6C4.14 8.14 2.31 10.53 1 11.5 2.73 15.89 7 19 12 19a10 10 0 003.4-.6"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            className="h-4.5 w-4.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M1 11.5C2.73 7.11 7 4 12 4s9.27 3.11 11 7.5C21.27 15.89 17 19 12 19s-9.27-3.11-11-7.5z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.5a3 3 0 100-6 3 3 0 000 6z" />
          </svg>
        )}
      </button>
    </div>
  );
}

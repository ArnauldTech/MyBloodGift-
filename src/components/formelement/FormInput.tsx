import React from "react"

type Inputelement = {
  label?: string
  id?: string
  name?: string
  error?: { message?: string } | string
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export const FormInput = React.forwardRef<HTMLInputElement, Inputelement>(
  ({ label, id, name, error, className = "", ...props }, ref) => {
    const inputId = id || name
    const errorMessage = typeof error === "string" ? error : error?.message

    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        {label && (
          <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <input
          id={inputId}
          name={name}
          ref={ref}
          {...props}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
        />
        {errorMessage && <p className="mt-0.5 text-sm text-red-500">{errorMessage}</p>}
      </div>
    )
  },
)

FormInput.displayName = "FormInput"

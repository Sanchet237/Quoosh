"use client"

import { AVATARS, AvatarKey } from "@quoosh/web/utils/avatars"
import Image from "next/image"

type Props = {
  selected: AvatarKey
  onChange: (key: AvatarKey) => void
}

const AvatarPicker = ({ selected, onChange }: Props) => {
  return (
    <div className="w-full">
      <p className="mb-2 text-center text-xs font-bold tracking-widest text-gray-500 uppercase">
        Pick your character
      </p>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {AVATARS.map(({ key, src, label }) => {
          const isSelected = selected === key
          return (
            <button
              key={key}
              type="button"
              title={label}
              onClick={() => onChange(key)}
              className="relative flex flex-col items-center rounded-xl border-2 p-1 transition-all duration-150 focus:outline-none"
              style={{
                borderColor: isSelected ? "#f59e0b" : "#e5e7eb",
                background: isSelected ? "#fffbeb" : "#f9fafb",
                boxShadow: isSelected ? "0 4px 0 #d97706" : "0 2px 0 #d1d5db",
                transform: isSelected ? "translateY(2px)" : "none",
              }}
            >
              <Image
                src={src}
                alt={label}
                width={40}
                height={40}
                className="h-9 w-9 object-contain"
              />
              {isSelected && (
                <span
                  className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-black text-white"
                  style={{ background: "#f59e0b" }}
                >
                  ✓
                </span>
              )}
            </button>
          )
        })}
      </div>
      <p className="mt-1.5 text-center text-[10px] font-semibold text-amber-600">
        {AVATARS.find((a) => a.key === selected)?.label}
      </p>
    </div>
  )
}

export default AvatarPicker

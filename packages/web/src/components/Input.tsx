import clsx from "clsx"
import React from "react"

type Props = React.InputHTMLAttributes<HTMLInputElement>

const Input = ({ className, type = "text", ...otherProps }: Props) => (
  <input
    type={type}
    className={clsx(
      "w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-base font-semibold text-gray-800 placeholder-gray-400 transition-all outline-none focus:border-amber-400 focus:bg-white",
      className,
    )}
    {...otherProps}
  />
)

export default Input

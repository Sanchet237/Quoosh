import clsx from "clsx"
import { ButtonHTMLAttributes, ElementType, PropsWithChildren } from "react"

type Props = PropsWithChildren &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: ElementType
  }

const AnswerButton = ({
  className,
  icon: Icon,
  children,
  ...otherProps
}: Props) => (
  <button
    className={clsx(
      "shadow-inset flex min-h-[4rem] w-full items-center gap-3 rounded px-4 py-5 text-left text-base leading-snug font-bold active:scale-95 sm:py-6 sm:text-lg",
      className,
    )}
    {...otherProps}
  >
    <Icon className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />
    <span className="drop-shadow-md">{children}</span>
  </button>
)

export default AnswerButton

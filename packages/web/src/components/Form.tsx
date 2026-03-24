import { PropsWithChildren } from "react"

const Form = ({ children }: PropsWithChildren) => (
  <div
    className="z-10 flex w-full max-w-xs flex-col gap-3 rounded-2xl bg-white p-5 sm:max-w-sm sm:gap-4 sm:p-6"
    style={{ boxShadow: "6px 6px 0px #d97706, 0 20px 60px rgba(0,0,0,0.25)" }}
  >
    {children}
  </div>
)

export default Form

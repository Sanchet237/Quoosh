import Button from "@quoosh/web/components/Button"
import Form from "@quoosh/web/components/Form"
import Input from "@quoosh/web/components/Input"
import { useEvent } from "@quoosh/web/contexts/socketProvider"
import { KeyboardEvent, useState } from "react"
import toast from "react-hot-toast"

type Props = {
  onSubmit: (_password: string) => void
}

const ManagerPassword = ({ onSubmit }: Props) => {
  const [password, setPassword] = useState("")

  const handleSubmit = () => {
    onSubmit(password)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSubmit()
    }
  }

  useEvent("manager:errorMessage", (message) => {
    toast.error(message)
  })

  return (
    <Form>
      <h2 className="text-center text-xl font-black tracking-tight text-gray-800">
        Manager Access
      </h2>
      <Input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Manager password"
      />
      <Button onClick={handleSubmit}>Enter</Button>
    </Form>
  )
}

export default ManagerPassword

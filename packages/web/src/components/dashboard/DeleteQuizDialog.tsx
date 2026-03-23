"use client"

import { useState } from "react"

interface DeleteQuizDialogProps {
  quizId: string
  quizTitle: string
  isOpen: boolean
  onClose: () => void
  onDeleted: () => void
}

export default function DeleteQuizDialog({
  quizId,
  quizTitle,
  isOpen,
  onClose,
  onDeleted,
}: DeleteQuizDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  if (!isOpen) return null

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/quizzes/${quizId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        onDeleted()
        onClose()
      } else {
        console.error("Failed to delete quiz")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-700 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-2">Delete Quiz</h2>
        <p className="text-gray-400 mb-6">
          Are you sure you want to delete <span className="text-white font-medium">"{quizTitle}"</span>? This action cannot be undone.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="bg-transparent hover:bg-gray-700 text-gray-300 border border-gray-600 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete Quiz"}
          </button>
        </div>
      </div>
    </div>
  )
}

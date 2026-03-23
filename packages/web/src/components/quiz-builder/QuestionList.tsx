"use client"

import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Plus, Trash2 } from "lucide-react"

export type QuestionData = {
  id: string
  text: string
  order: number
}

type QuestionListProps = {
  questions: QuestionData[]
  activeId: string | null
  onQuestionSelect: (id: string) => void
  onAddBlank: () => void
  onDelete: (id: string) => void
  onReorder: (newOrder: QuestionData[]) => void
}

// Sub-component representing a single draggable item
function SortableItem({
  question,
  isActive,
  onSelect,
  onDelete,
  index
}: {
  question: QuestionData
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
  index: number
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
        isActive
          ? "bg-blue-50 border-blue-500 shadow-sm"
          : "bg-white border-gray-200 hover:border-gray-300 shadow-sm"
      } ${isDragging ? "opacity-50 border-dashed" : "opacity-100"}`}
      onClick={onSelect}
    >
      <div
        {...attributes}
        {...listeners}
        className="mr-3 cursor-grab hover:text-white text-gray-400 touch-none p-1 rounded hover:bg-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="w-4 h-4" />
      </div>

      <div className="flex-1 truncate">
        <span className="text-xs font-bold text-gray-400 mr-2">{index + 1}.</span>
        <span className={`text-sm font-bold truncate inline-block w-28 align-bottom ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
          {question.text || "Empty Question"}
        </span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className={`p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors ${
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        title="Delete Question"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export default function QuestionList({
  questions,
  activeId,
  onQuestionSelect,
  onAddBlank,
  onDelete,
  onReorder,
}: QuestionListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 }, // require a 3px move to drag to avoid click interception
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id)
      const newIndex = questions.findIndex((q) => q.id === over.id)
      
      const newArray = arrayMove(questions, oldIndex, newIndex)
      
      // Update their `order` properties structurally
      const ordered = newArray.map((q, i) => ({ ...q, order: i }))
      onReorder(ordered)
    }
  }

  // Ensure questions are sorted locally before rendering
  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order)

  return (
    <div className="w-64 bg-transparent flex flex-col h-full relative border-r border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-transparent sticky top-0 z-10 flex justify-between items-center shrink-0">
        <h2 className="font-bold text-black flex items-center gap-2">
          Questions
          <span className="text-xs bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full border border-gray-200">
            {questions.length}
          </span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedQuestions.map(q => q.id)}
            strategy={verticalListSortingStrategy}
          >
            {sortedQuestions.map((q, idx) => (
              <SortableItem
                key={q.id}
                index={idx}
                question={q}
                isActive={activeId === q.id}
                onSelect={() => onQuestionSelect(q.id)}
                onDelete={() => onDelete(q.id)}
              />
            ))}
          </SortableContext>
        </DndContext>

        {questions.length === 0 && (
          <div className="text-center py-10 px-4 text-amber-400/50 text-sm border-2 border-dashed border-amber-900/40 rounded-lg">
            No questions yet. Create one or import some!
          </div>
        )}
      </div>

      <div className="p-4 bg-transparent border-t border-gray-200 sticky bottom-0 shrink-0">
        <button
          onClick={onAddBlank}
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white transition-all font-bold py-3 rounded-lg shadow-sm"
        >
          <Plus className="w-5 h-5" /> Add Question
        </button>
      </div>
    </div>
  )
}

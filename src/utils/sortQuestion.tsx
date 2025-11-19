import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableQuestion({ id, children }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Container chính */}
      <div className="relative">
        {/* Drag handle */}
        <div
          {...listeners}
          {...attributes}
          className="absolute left-[-12px] top-4 cursor-grab active:cursor-grabbing p-2">
          ⠿
        </div>

        {children}
      </div>
    </div>
  );
}

export default SortableQuestion;

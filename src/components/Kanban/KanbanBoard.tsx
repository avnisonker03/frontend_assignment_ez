import { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import type { ColumnType } from "./types";
import { Column } from "./Column";
import "./kanban.css";

const initialColumns: ColumnType[] = [
  { id: "todo", title: "Todo", cards: [] },
  { id: "progress", title: "In Progress", cards: [] },
  { id: "done", title: "Done", cards: [] },
];

export const KanbanBoard = () => {
  const [columns, setColumns] = useState<ColumnType[]>(initialColumns);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const fromColumnId = active.data.current?.columnId;
    const toColumnId = over.id;

    if (!fromColumnId || fromColumnId === toColumnId) return;

    setColumns(prev => {
      const fromColumn = prev.find(col => col.id === fromColumnId)!;
    //   const toColumn = prev.find(col => col.id === toColumnId)!;

      const card = fromColumn.cards.find(c => c.id === active.id)!;

      return prev.map(col => {
        if (col.id === fromColumnId) {
          return { ...col, cards: col.cards.filter(c => c.id !== card.id) };
        }
        if (col.id === toColumnId) {
          return { ...col, cards: [...col.cards, card] };
        }
        return col;
      });
    });
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {columns.map(column => (
          <Column
            key={column.id}
            column={column}
            setColumns={setColumns}
          />
        ))}
      </div>
    </DndContext>
  );
};

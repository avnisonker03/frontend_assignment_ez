import { useDroppable } from "@dnd-kit/core";
import type { ColumnType } from "./types";
import { Card } from "./Card";

type Props = {
  column: ColumnType;
  setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>;
};

export const Column = ({ column, setColumns }: Props) => {
  const { setNodeRef } = useDroppable({ id: column.id });

  const addCard = () => {
    const title = prompt("Enter card title");
    if (!title) return;

    setColumns(prev =>
      prev.map(col =>
        col.id === column.id
          ? {
              ...col,
              cards: [
                ...col.cards,
                { id: crypto.randomUUID(), title },
              ],
            }
          : col
      )
    );
  };

  return (
    <div className="column" ref={setNodeRef}>
      <h3>{column.title}</h3>
      <button onClick={addCard} className="add-card">
        + Add Card
      </button>

      {column.cards.map(card => (
        <Card
          key={card.id}
          card={card}
          columnId={column.id}
          setColumns={setColumns}
        />
      ))}
    </div>
  );
};

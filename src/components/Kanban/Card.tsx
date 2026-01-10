import { useDraggable } from "@dnd-kit/core";
import type { CardType, ColumnType } from "./types";

type Props = {
  card: CardType;
  columnId: string;
  setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>;
};

export const Card = ({ card, columnId, setColumns }: Props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
    data: { columnId },
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  const editCard = () => {
    const title = prompt("Edit card title", card.title);
    if (!title) return;

    setColumns(prev =>
      prev.map(col =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.map(c =>
                c.id === card.id ? { ...c, title } : c
              ),
            }
          : col
      )
    );
  };

  const deleteCard = () => {
    setColumns(prev =>
      prev.map(col =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.filter(c => c.id !== card.id),
            }
          : col
      )
    );
  };

  return (
    <div ref={setNodeRef} style={style} className="card" {...listeners} {...attributes}>
      <span onDoubleClick={editCard}>{card.title}</span>
      <button onClick={deleteCard}>✕</button>
    </div>
  );
};

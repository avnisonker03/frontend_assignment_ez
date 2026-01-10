import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";

export const Card = ({ card, columnId, setColumns }: any) => {
  const [isEditOpen, setEditOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(card.title);
  
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
    data: { columnId },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleEdit = () => {
    setColumns((prev: any) => prev.map((col: any) => 
      col.id === columnId ? {
        ...col,
        cards: col.cards.map((c: any) => c.id === card.id ? { ...c, title: newTitle } : c)
      } : col
    ));
    setEditOpen(false);
  };

  const deleteCard = (e: React.MouseEvent) => {
    e.stopPropagation(); // FIX: Prevents dragging when clicking delete
    setColumns((prev: any) => prev.map((col: any) => 
      col.id === columnId ? { ...col, cards: col.cards.filter((c: any) => c.id !== card.id) } : col
    ));
  };

  return (
    <>
      <div 
        ref={setNodeRef} 
        style={style} 
        className="card" 
        {...listeners} 
        {...attributes}
        onDoubleClick={() => setEditOpen(true)}
      >
        <span className="card-text">{card.title}</span>
        <button className="delete-btn" onPointerDown={deleteCard}>🗑</button>
      </div>

      {isEditOpen && (
        <div className="modal-overlay" onPointerDown={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <h3>Edit Card</h3>
            <input 
              style={{ width: '100%', padding: '10px', marginTop: '10px' }}
              value={newTitle} 
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setEditOpen(false)}>Cancel</button>
              <button className="btn-save" onClick={handleEdit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
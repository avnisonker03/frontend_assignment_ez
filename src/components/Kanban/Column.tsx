import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Card } from "./Card";

export const Column = ({ column, setColumns }: any) => {
  const { setNodeRef } = useDroppable({ id: column.id });
  const [isModalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;
    setColumns((prev: any) => prev.map((col: any) => 
      col.id === column.id ? { ...col, cards: [...col.cards, { id: crypto.randomUUID(), title }] } : col
    ));
    setTitle("");
    setModalOpen(false);
  };

  return (
    <div className="column" data-id={column.id} ref={setNodeRef}>
      <div className="column-header">
        <div>{column.title} <span className="card-count">{column.cards.length}</span></div>
        <button className="add-card-btn" onClick={() => setModalOpen(true)}>+</button>
      </div>

      <div className="cards-container" style={{ padding: '4px' }}>
        {column.cards.map((card: any) => (
          <Card key={card.id} card={card} columnId={column.id} setColumns={setColumns} />
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Card</h3>
            <input 
              style={{ width: '100%', padding: '10px', marginTop: '10px',marginRight:'20px',fontSize:'20px'}}
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Enter title..."
              autoFocus
            />    
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn-save" onClick={handleAdd}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
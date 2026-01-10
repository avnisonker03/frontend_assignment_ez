import { useState } from "react";
import type { TreeNode } from "./types";
import { updateNode, removeNode } from "./helpers";

type Props = {
  node: TreeNode;
  setTree: React.Dispatch<React.SetStateAction<TreeNode[]>>;
};

type ModalState = {
  isOpen: boolean;
  type: "add" | "edit" | "delete" | null;
  inputValue: string;
};

export const TreeNodeItem = ({ node, setTree }: Props) => {
  // New State for handling the Custom Dialog
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: null,
    inputValue: "",
  });

  const toggleExpand = () => {
    setTree((prev) =>
      updateNode(prev, node.id, (n) => {
        if (!n.isExpanded && (!n.children || n.children.length === 0)) {
          return { ...n, isExpanded: true, isLoading: true };
        }
        return { ...n, isExpanded: !n.isExpanded };
      })
    );

    if (!node.isExpanded && (!node.children || node.children.length === 0)) {
      setTimeout(() => {
        setTree((prev) =>
          updateNode(prev, node.id, (n) => ({
            ...n,
            isLoading: false,
            children: [
              {
                id: crypto.randomUUID(),
                label: "New Node",
                children: [],
                isExpanded: false,
                isLoading: false,
              },
            ],
          }))
        );
      }, 800);
    }
  };

  // --- Modal Triggers ---
  const openAddModal = () => {
    setModal({ isOpen: true, type: "add", inputValue: "" });
  };

  const openEditModal = () => {
    setModal({ isOpen: true, type: "edit", inputValue: node.label });
  };

  const openDeleteModal = () => {
    setModal({ isOpen: true, type: "delete", inputValue: "" });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: null, inputValue: "" });
  };

  // --- Logic Execution on Confirm ---
  const handleConfirm = () => {
    if (modal.type === "add") {
      if (!modal.inputValue.trim()) return;
      setTree((prev) =>
        updateNode(prev, node.id, (n) => ({
          ...n,
          children: [
            ...(n.children || []),
            {
              id: crypto.randomUUID(),
              label: modal.inputValue,
              children: [],
              isExpanded: false,
              isLoading: false,
            },
          ],
          isExpanded: true,
        }))
      );
    }

    if (modal.type === "edit") {
      if (!modal.inputValue.trim()) return;
      setTree((prev) =>
        updateNode(prev, node.id, (n) => ({ ...n, label: modal.inputValue }))
      );
    }

    if (modal.type === "delete") {
      setTree((prev) => removeNode(prev, node.id));
    }

    closeModal();
  };

  return (
    <>
      <div className="tree-node">
        <div className="node-row">
          <span
            onClick={toggleExpand}
            className="toggle"
            style={{
              visibility:
                (node.children && node.children.length > 0) || !node.isExpanded
                  ? "visible"
                  : "hidden",
            }}
          >
            {node.isExpanded ? "▼" : "▶"}
          </span>

          <span className="label">{node.label}</span>

          <div className="actions">
            <button onClick={openAddModal} className="action-btn add" title="Add Child">
              +
            </button>
            <button onClick={openEditModal} className="action-btn edit" title="Edit">
              ✎
            </button>
            {/* Logic: Only show delete if NOT root (id !== "1") */}
            {node.id !== "1" && (
              <button onClick={openDeleteModal} className="action-btn delete" title="Delete">
                🗑
              </button>
            )}
          </div>
        </div>

        {node.isLoading && <div className="loading">Loading children...</div>}

        {node.isExpanded && node.children && (
          <div className="children">
            {node.children.map((child) => (
              <TreeNodeItem
                key={child.id}
                node={child}
                setTree={setTree}
              />
            ))}
          </div>
        )}
      </div>

      {/* --- Custom Modal Rendering --- */}
      {modal.isOpen && (
        <div className="modal-overlay" onClick={(e) => {
            // Close if clicking strictly on the dark overlay
            if(e.target === e.currentTarget) closeModal();
        }}>
          <div className="modal-box">
            <div className="modal-title">
              {modal.type === "add" && "Add New Child"}
              {modal.type === "edit" && "Edit Node"}
              {modal.type === "delete" && "Delete Node?"}
            </div>

            {modal.type !== "delete" ? (
              <input
                autoFocus
                type="text"
                className="modal-input"
                value={modal.inputValue}
                onChange={(e) => setModal({ ...modal, inputValue: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                placeholder="Enter node name..."
              />
            ) : (
              <p style={{ color: "#666", fontSize: "14px" }}>
                Are you sure you want to delete <b>{node.label}</b> and all its children?
              </p>
            )}

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal}>
                Cancel
              </button>
              <button
                className={`btn-confirm ${modal.type === "delete" ? "danger" : ""}`}
                onClick={handleConfirm}
              >
                {modal.type === "delete" ? "Delete" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
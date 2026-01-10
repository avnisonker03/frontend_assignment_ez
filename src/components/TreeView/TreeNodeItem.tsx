import type { TreeNode } from "./types";
import { updateNode, removeNode } from "./helpers";

type Props = {
  node: TreeNode;
  setTree: React.Dispatch<React.SetStateAction<TreeNode[]>>;
};

export const TreeNodeItem = ({ node, setTree }: Props) => {
  const toggleExpand = () => {
    setTree(prev =>
      updateNode(prev, node.id, n => {
        if (!n.isExpanded && (!n.children || n.children.length === 0)) {
          return { ...n, isExpanded: true, isLoading: true };
        }
        return { ...n, isExpanded: !n.isExpanded };
      })
    );

    if (!node.isExpanded && (!node.children || node.children.length === 0)) {
      setTimeout(() => {
        setTree(prev =>
          updateNode(prev, node.id, n => ({
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

  const addChild = () => {
    const name = prompt("Enter node name");
    if (!name) return;

    setTree(prev =>
      updateNode(prev, node.id, n => ({
        ...n,
        children: [
          ...(n.children || []),
          {
            id: crypto.randomUUID(),
            label: name,
            children: [],
            isExpanded: false,
            isLoading: false,
          },
        ],
        isExpanded: true,
      }))
    );
  };

  const editNode = () => {
    const name = prompt("Edit node name", node.label);
    if (!name) return;

    setTree(prev =>
      updateNode(prev, node.id, n => ({ ...n, label: name }))
    );
  };

  const deleteNode = () => {
    if (!window.confirm("Delete this node and its children?")) return;
    setTree(prev => removeNode(prev, node.id));
  };

  return (
    <div className="tree-node">
      <div className="node-row">
        <span onClick={toggleExpand} className="toggle">
          {node.isExpanded ? "▼" : "▶"}
        </span>

        <span className="label">{node.label}</span>

        <button onClick={addChild}>+</button>
        <button onClick={editNode}>✎</button>
        <button onClick={deleteNode}>🗑</button>
      </div>

      {node.isLoading && <div className="loading">Loading...</div>}

      {node.isExpanded && node.children && (
        <div className="children">
          {node.children.map(child => (
            <TreeNodeItem
              key={child.id}
              node={child}
              setTree={setTree}
            />
          ))}
        </div>
      )}
    </div>
  );
};

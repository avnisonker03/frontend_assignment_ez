import { useState } from "react";
import type { TreeNode } from "./types";
import { TreeNodeItem } from "./TreeNodeItem";
import "./tree.css";

const initialTree: TreeNode[] = [
  {
    id: "1",
    label: "Root",
    children: [],
    isExpanded: false,
    isLoading: false,
  },
];

export const TreeView = () => {
  const [tree, setTree] = useState<TreeNode[]>(initialTree);

  return (
    <div className="tree-container">
      {tree.map(node => (
        <TreeNodeItem
          key={node.id}
          node={node}
          setTree={setTree}
        />
      ))}
    </div>
  );
};

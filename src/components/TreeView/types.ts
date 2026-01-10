export type TreeNode = {
  id: string;
  label: string;
  children?: TreeNode[];
  isExpanded: boolean;
  isLoading: boolean;
};

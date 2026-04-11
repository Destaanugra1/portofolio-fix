export type TechItem = {
  id: string;
  name: string;
  desc: string;
  icon: string;
  color?: string; // Used for right side
};

export type GroupConfig = {
  id: string;
  label: string;
  color: string;
  items: TechItem[];
};
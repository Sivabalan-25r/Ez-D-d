import { create } from 'zustand';

// Generate safe IDs
const uuidv4 = () => crypto.randomUUID();

export const useBuilderStore = create((set, get) => ({
  elements: [],
  selectedId: null,

  addElement: (type, parentId = null) => {
    const newNode = {
      id: uuidv4(),
      type,
      props: { className: 'p-4 min-h-[50px] bg-slate-100 text-slate-900 rounded shadow-sm m-2' },
      children: [],
      content: type === 'Text' ? 'Hello from React Builder' : null
    };

    set((state) => {
      // For now, MVP: append to root elements array if no parent
      if (!parentId) {
        return { elements: [...state.elements, newNode] };
      }
      
      // Recursive tree injection logic for Advanced Mode
      const appendToParent = (nodes) => {
        return nodes.map(node => {
          if (node.id === parentId) {
            return { ...node, children: [...node.children, newNode] };
          }
          if (node.children) {
            return { ...node, children: appendToParent(node.children) };
          }
          return node;
        });
      };
      
      return { elements: appendToParent(state.elements) };
    });
  },

  selectElement: (id) => set({ selectedId: id }),

  updateElementProps: (id, newProps) => {
    set((state) => {
      const updateNode = (nodes) => {
        return nodes.map(node => {
          if (node.id === id) {
            return { ...node, props: { ...node.props, ...newProps } };
          }
          if (node.children) {
            return { ...node, children: updateNode(node.children) };
          }
          return node;
        });
      };
      return { elements: updateNode(state.elements) };
    });
  },

  updateElementContent: (id, content) => {
    set((state) => {
        const updateNode = (nodes) => nodes.map(node => {
            if (node.id === id) return { ...node, content };
            if (node.children) return { ...node, children: updateNode(node.children) };
            return node;
        });
        return { elements: updateNode(state.elements) };
    });
  }
}));

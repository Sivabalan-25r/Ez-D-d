import { useBuilderStore } from '../store/useBuilder';

export function Sidebar() {
  const library = [
    { type: 'Container', icon: 'crop_free' },
    { type: 'Grid', icon: 'grid_view' },
    { type: 'Text', icon: 'title' },
    { type: 'Button', icon: 'add_box' },
    { type: 'Image', icon: 'image' },
  ];

  const onDragStart = (e, type) => {
    e.dataTransfer.setData('application/ezdd-react', type);
  };

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-full z-40 relative">
      <div className="p-4 border-b border-slate-800/40">
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-1">Library</h2>
      </div>
      <div className="p-4 space-y-2 overflow-y-auto">
        {library.map(comp => (
          <div 
             key={comp.type}
             draggable
             onDragStart={(e) => onDragStart(e, comp.type)}
             className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded hover:border-emerald-500/50 hover:bg-slate-800 cursor-grab active:cursor-grabbing transition-colors"
          >
            <span className="material-symbols-outlined text-slate-400 text-sm">{comp.icon}</span>
            <span className="text-xs font-medium text-slate-300">{comp.type}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

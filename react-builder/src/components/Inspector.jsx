import { useBuilderStore } from '../store/useBuilder';

export function Inspector() {
  const { elements, selectedId, updateElementProps, updateElementContent } = useBuilderStore();

  let activeNode = null;
  const findNode = (nodes) => {
    for (let node of nodes) {
      if (node.id === selectedId) activeNode = node;
      if (node.children) findNode(node.children);
    }
  };
  findNode(elements);

  if (!activeNode) {
    return (
      <aside className="w-72 bg-slate-950 border-l border-slate-800 p-5 flex flex-col items-center justify-center text-center opacity-50 z-40 relative">
        <span className="material-symbols-outlined text-4xl mb-2 text-slate-700">target</span>
        <p className="text-[10px] tracking-widest uppercase font-bold text-slate-500">No Component Selected</p>
      </aside>
    );
  }

  return (
    <aside className="w-72 bg-slate-950 border-l border-slate-800 flex flex-col h-full z-40 relative">
      <div className="p-5 border-b border-slate-800/40">
        <h2 className="text-[10px] uppercase tracking-[0.25em] text-slate-100 font-bold">Inspector</h2>
        <p className="text-[9px] text-emerald-400 font-bold mt-1 uppercase tracking-widest">{activeNode.type} Selected</p>
      </div>

      <div className="p-5 space-y-6 overflow-y-auto">
        {/* Style Editor */}
        <div className="space-y-2">
            <label className="text-[9px] uppercase font-bold text-slate-600 tracking-wider">Tailwind Classes</label>
            <textarea 
               value={activeNode.props.className}
               onChange={(e) => updateElementProps(selectedId, { className: e.target.value })}
               className="w-full h-24 bg-slate-900 border border-slate-800 rounded p-2 text-[10px] font-mono text-emerald-300 focus:outline-none focus:border-emerald-500/50 resize-none"
            />
        </div>

        {/* Content Editor */}
        {activeNode.content !== null && (
          <div className="space-y-2">
            <label className="text-[9px] uppercase font-bold text-slate-600 tracking-wider">Text Content</label>
            <textarea 
               value={activeNode.content || ''}
               onChange={(e) => updateElementContent(selectedId, e.target.value)}
               className="w-full h-16 bg-slate-900 border border-slate-800 rounded p-2 text-[11px] text-slate-200 focus:outline-none focus:border-emerald-500/50 resize-none"
            />
          </div>
        )}

        {/* AI Action */}
        <div className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/10 rounded-lg p-4 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 block">AI Refinement</span>
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all">
                <span className="material-symbols-outlined !text-[14px]">auto_awesome</span>
                <span>Refine Structure</span>
            </button>
        </div>
      </div>
    </aside>
  );
}

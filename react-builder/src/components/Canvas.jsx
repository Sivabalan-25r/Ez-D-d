import { useBuilderStore } from '../store/useBuilder';

export function Canvas() {
  const { elements, addElement, selectElement, selectedId } = useBuilderStore();

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/ezdd-react');
    if (type) {
      addElement(type);
    }
  };

  const RenderNode = ({ node }) => {
    const isSelected = selectedId === node.id;
    const Tag = node.type === 'Text' ? 'p' : node.type === 'Button' ? 'button' : 'div';
    
    return (
      <Tag 
        className={`builder-element relative ${node.props.className} ${isSelected ? 'selected' : ''}`}
        onClick={(e) => { e.stopPropagation(); selectElement(node.id); }}
      >
        <span className="el-label">{node.type}</span>
        {node.content || null}
        {node.children && node.children.map(child => <RenderNode key={child.id} node={child} />)}
      </Tag>
    );
  };

  return (
    <main 
      className="flex-1 bg-slate-900 bg-[radial-gradient(#334155_1px,transparent_1px)] bg-[length:32px_32px] flex flex-col items-center justify-start py-12 px-8 overflow-y-auto"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => selectElement(null)}
    >
      <div className="w-full max-w-4xl min-h-[700px] bg-white text-slate-950 shadow-2xl relative select-none rounded p-4" id="canvas-frame">
        {elements.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40 pointer-events-none">
                <span className="material-symbols-outlined text-6xl mb-4 text-emerald-500">add_circle</span>
                <p className="font-bold tracking-widest uppercase text-xs">Drop Components Here</p>
            </div>
        )}
        {elements.map(el => <RenderNode key={el.id} node={el} />)}
      </div>
    </main>
  );
}

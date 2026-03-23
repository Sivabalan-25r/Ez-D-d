import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { Inspector } from './components/Inspector';

function App() {
  return (
    <div className="flex h-screen bg-background text-white font-sans overflow-hidden">
      {/* Top Header */}
      <header className="fixed top-0 w-full z-50 bg-slate-950 border-b border-slate-800 flex justify-between items-center px-4 h-14">
        <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-500">architecture</span>
            <span className="text-sm font-bold tracking-widest uppercase">Ez-React Builder</span>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-[10px] uppercase font-bold px-4 py-2 rounded">
            Export JSON
        </button>
      </header>

      {/* Main 3-Panel Layout */}
      <div className="flex w-full pt-14 h-full">
        <Sidebar />
        <Canvas />
        <Inspector />
      </div>
    </div>
  )
}

export default App;

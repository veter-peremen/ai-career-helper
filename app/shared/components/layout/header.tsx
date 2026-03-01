import { Search, Bell } from 'lucide-react'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-sm border-b border-slate-100 z-20 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Поиск..." 
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl cursor-pointer flex items-center justify-center text-white font-medium">
          U
        </div>
      </div>
    </header>
  )
}

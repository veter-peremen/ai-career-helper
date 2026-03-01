import { Link } from "react-router"
import { Map, Bot, User, BookOpen, LogOut } from 'lucide-react'

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-full pt-20 z-10 shadow-sm">
      <div className="p-6 border-b border-slate-50">
        <h2 className="text-lg font-bold text-slate-800">ИИ-ассистент</h2>
      </div>
      
      <nav className="flex flex-col gap-2 p-4">
        <Link to="/roadmap" className="flex items-center gap-3 p-3 rounded-xl text-slate-400 font-medium hover:bg-slate-50 hover:text-blue-600 transition-colors">
          <Map size={20} /> <span>Дорожная карта</span>
        </Link>
        <Link to="/chat" className="flex items-center gap-3 p-3 rounded-xl bg-blue-600 text-white font-medium shadow-sm transition-colors">
          <Bot size={20} /> <span>ИИ-ассистент</span>
        </Link>
        <Link to="/profile" className="flex items-center gap-3 p-3 rounded-xl text-slate-400 font-medium hover:bg-slate-50 hover:text-blue-600 transition-colors">
          <User size={20} /> <span>Мой профиль</span>
        </Link>
        <Link to="/knowledge-base" className="flex items-center gap-3 p-3 rounded-xl text-slate-400 font-medium hover:bg-slate-50 hover:text-blue-600 transition-colors">
          <BookOpen size={20} /> <span>База знаний</span>
        </Link>
      </nav>

      <div className="mt-auto p-4 border-t border-slate-50">
        <button className="flex items-center gap-3 text-red-500 font-medium opacity-70 hover:opacity-100 transition-opacity w-fit">
          <LogOut size={20} /> <span>Выйти</span>
        </button>
      </div>
    </aside>
  )
}

import { useEffect, useMemo } from "react"
import {
  Link,
  useFetcher,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "react-router"
import {
  Search, Bell, Bot, Paperclip, Mic, Send, MessageSquarePlus
} from 'lucide-react'
import type { Route } from "./+types/chat"
import { createChat, getChatById, getChats } from "~/modules/chat/api/chats"
import type { ChatWithMessages } from "~/modules/chat/model/types"
import { Button } from "~/shared/components/ui/button"
import { Input } from "~/shared/components/ui/input"
import { Skeleton } from "~/shared/components/ui/skeleton"
import { AppLayout } from "~/shared/components/layout/app-layout"

const CHATS_LIMIT = 50
const MESSAGES_LIMIT = 50

export function meta({}: Route.MetaArgs) {
  return [{ title: "Чаты" }]
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url)
  const selectedChatId = url.searchParams.get("chatId")
  const chatsData = await getChats({ limit: CHATS_LIMIT, offset: 0 })

  const chats = chatsData.items
  const fallbackChatId = chats[0]?.id ?? null
  const chatId =
    selectedChatId && chats.some((chat) => chat.id === selectedChatId)
      ? selectedChatId
      : fallbackChatId

  let selectedChat: ChatWithMessages | null = null
  if (chatId) {
    const chatData = await getChatById({
      id: chatId,
      limit: MESSAGES_LIMIT,
      offset: 0,
    })
    selectedChat = chatData.items[0] ?? null
  }

  return { chats, selectedChat, selectedChatId: chatId }
}

export async function clientAction({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const title = String(formData.get("title") ?? "").trim()

  if (!title) return { error: "Введите название чата" }

  const chat = await createChat(title)
  return { chat }
}

export default function Chat() {
  const { chats, selectedChat, selectedChatId } = useLoaderData<typeof clientLoader>()
  const [, setSearchParams] = useSearchParams()
  const fetcher = useFetcher<typeof clientAction>()
  const navigation = useNavigation()
  const isLoading = navigation.state === "loading"

  useEffect(() => {
    if (fetcher.data?.chat) {
      setSearchParams({ chatId: fetcher.data.chat.id })
    }
  }, [fetcher.data, setSearchParams])

  const selectedTitle = useMemo(() => {
    if (!selectedChatId) return "Выберите чат"
    return chats.find((chat) => chat.id === selectedChatId)?.title ?? "Чат"
  }, [chats, selectedChatId])

  return (
    <AppLayout>
      <div className="grid min-h-[calc(100vh-140px)] gap-6 lg:grid-cols-[320px_1fr]">
        
        {/* Левая панель: Список чатов */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col h-full p-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">
            Ваши диалоги
          </h3>
          
          <fetcher.Form method="post" className="flex gap-2 mb-4">
            <Input 
              name="title" 
              placeholder="Новый чат" 
              autoComplete="off" 
              className="bg-slate-50 border-slate-200 focus-visible:ring-blue-600"
            />
            <Button 
              type="submit" 
              disabled={fetcher.state === "submitting"} 
              className="bg-blue-600 hover:bg-blue-700 px-3 shrink-0"
            >
              <MessageSquarePlus size={18} />
            </Button>
          </fetcher.Form>
          
          {fetcher.data?.error && (
            <p className="text-sm text-red-500 px-1 mb-2">{fetcher.data.error}</p>
          )}

          <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
            {chats.length === 0 ? (
              <p className="text-sm text-slate-400 px-2">Чатов пока нет.</p>
            ) : (
              chats.map((chat) => {
                const isActive = chat.id === selectedChatId
                return (
                  <Link
                    key={chat.id}
                    to={`?chatId=${chat.id}`}
                    className={[
                      "flex flex-col gap-1 rounded-xl p-3 text-sm transition-colors border",
                      isActive
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-transparent text-slate-600 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <span className="font-medium truncate">{chat.title}</span>
                    <span className="text-xs opacity-60">
                      {new Date(chat.lastActivityTime).toLocaleDateString("ru-RU")}
                    </span>
                  </Link>
                )
              })
            )}
          </div>
        </div>

        {/* Правая панель: Зона диалога */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col h-full p-4">
          <div className="text-center mb-4 pb-4 border-b border-slate-100">
            <h1 className="text-xl font-semibold text-slate-800">{selectedTitle}</h1>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-4 mb-4 px-2">
            {isLoading ? (
              <div className="max-w-3xl mx-auto w-full flex flex-col gap-4">
                <Skeleton className="h-16 w-3/4 rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
              </div>
            ) : selectedChat ? (
              <div className="max-w-3xl mx-auto w-full flex flex-col gap-4">
                {selectedChat.messages.length === 0 ? (
                  <p className="text-center text-sm text-slate-400 my-10">Здесь пока пусто.</p>
                ) : (
                  selectedChat.messages.map((message) => (
                    <div 
                      key={message.id} 
                      className="bg-slate-50 border border-slate-100 shadow-sm rounded-2xl p-4 text-sm w-fit max-w-[80%]"
                    >
                      <p className="text-xs font-semibold text-blue-600 mb-1">
                        {message.senderTypeId}
                      </p>
                      <p className="text-slate-700 leading-relaxed">{message.text}</p>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                  <Bot size={32} />
                </div>
              </div>
            )}
          </div>

          <div className="max-w-3xl mx-auto w-full">
            <div className="flex items-center justify-between p-3 pl-6 bg-white border-2 border-blue-600 rounded-2xl shadow-[0_4px_15px_rgba(1,87,255,0.15)]">
              <input 
                type="text" 
                placeholder="Спроси меня о чём угодно..." 
                className="flex-1 outline-none text-base text-slate-700 bg-transparent placeholder:text-slate-400"
                disabled={!selectedChat}
              />
              <div className="flex items-center gap-1">
                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-full" disabled={!selectedChat}>
                  <Paperclip size={20} />
                </button>
                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-full" disabled={!selectedChat}>
                  <Mic size={20} />
                </button>
                <button 
                  className="p-3 ml-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed"
                  disabled={!selectedChat}
                >
                  <Send size={18} className="ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  )
}

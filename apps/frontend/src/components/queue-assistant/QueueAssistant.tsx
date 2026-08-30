import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Bot, LoaderCircle, MessageCircle, Send, X } from 'lucide-react'
import { ApiError, apiFetch } from '../../lib/api'


interface ChatMessage {
  id: string
  role: 'assistant' | 'user'
  content: string
}

interface QueueAssistantProps {
  reportId?: string
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'Halo! Tanyakan posisi atau alasan skor prioritas laporan di Aspiraku.',
}

//<---------- QueueAssistant ------------>
export default function QueueAssistant({ reportId }: QueueAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const messageEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  //<---------- handleSubmit ------------>
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedQuestion = question.trim()
    if (!trimmedQuestion || isLoading) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmedQuestion,
    }

    setMessages((current) => [...current, userMessage])
    setQuestion('')
    setIsLoading(true)

    try {
      const answer = await apiFetch<{ jawaban: string }>('/ai-assistant/ask', {
        method: 'POST',
        body: JSON.stringify({
          pertanyaan: trimmedQuestion,
          ...(reportId ? { report_id: reportId } : {}),
        }),
      })

      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: 'assistant', content: answer.jawaban },
      ])
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Terjadi gangguan. Coba kirim pertanyaan lagi.'
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: 'assistant', content: message },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
      {isOpen && (
        <section
          aria-label="Asisten Aspiraku"
          className="mb-3 flex h-[min(32rem,calc(100dvh-7rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl"
        >
          <header className="flex items-start justify-between gap-3 border-b border-neutral-100 bg-neutral-900 px-4 py-3 text-white">
            <div className="flex gap-2.5">
              <Bot className="mt-0.5 size-5 shrink-0" aria-hidden />
              <div>
                <h2 className="font-semibold">Asisten Antrean</h2>
                <p className="text-xs text-neutral-300">Tanya posisi dan skor laporan</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-neutral-300 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Tutup chat asisten"
            >
              <X className="size-5" aria-hidden />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-neutral-50 p-4" aria-live="polite">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <p
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'rounded-br-md bg-neutral-900 text-white'
                      : 'rounded-bl-md border border-neutral-200 bg-white text-neutral-700'
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <p className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-500">
                  <LoaderCircle className="size-4 animate-spin" aria-hidden /> Menyiapkan jawaban…
                </p>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-neutral-200 bg-white p-3">
            <label htmlFor="queue-assistant-question" className="sr-only">
              Pertanyaan untuk asisten
            </label>
            <input
              ref={inputRef}
              id="queue-assistant-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              maxLength={500}
              disabled={isLoading}
              placeholder="Contoh: Kenapa laporan ini di posisi ini?"
              className="min-w-0 flex-1 rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-200 disabled:bg-neutral-50"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-neutral-900 p-2 text-white hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:cursor-not-allowed disabled:bg-neutral-300"
              aria-label="Kirim pertanyaan"
            >
              <Send className="size-5" aria-hidden />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="ml-auto flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-controls="queue-assistant-question"
      >
        {isOpen ? <X className="size-5" aria-hidden /> : <MessageCircle className="size-5" aria-hidden />}
        <span>{isOpen ? 'Tutup chat' : 'Tanya asisten'}</span>
      </button>
    </div>
  )
}

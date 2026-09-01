import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { LoaderCircle, MessageCircle, Send, X } from 'lucide-react'
import { ApiError, apiFetch } from '../../lib/api'
import { useMediaQuery } from '../../hooks/useMediaQuery'


interface ChatMessage {
  id: string
  role: 'assistant' | 'user'
  content: string
}

interface QueueAssistantProps {
  reportId?: string
  lifted?: boolean
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'Halo! Tanyakan posisi atau alasan skor prioritas laporan di Aspiraku.',
}

//<---------- QueueAssistant ------------>
export default function QueueAssistant({ reportId, lifted = false }: QueueAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const messageEndRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery('(min-width: 640px)')

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
    <div className="pointer-events-none fixed inset-0 z-[600] sm:inset-auto sm:right-6 sm:bottom-6 sm:flex sm:flex-col sm:items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            key="chat"
            aria-label="Asisten Aspiraku"
            initial={isDesktop ? { opacity: 0, scale: 0.95, y: 8 } : { y: '100%' }}
            animate={isDesktop ? { opacity: 1, scale: 1, y: 0 } : { y: 0 }}
            exit={isDesktop ? { opacity: 0, scale: 0.95, y: 8 } : { y: '100%' }}
            transition={{ duration: isDesktop ? 0.2 : 0.35, ease: [0.76, 0, 0.24, 1] }}
            className="pointer-events-auto absolute inset-0 flex flex-col overflow-hidden bg-white sm:static sm:mb-3 sm:h-[min(32rem,calc(100dvh-7rem))] sm:w-[calc(100vw-2rem)] sm:max-w-sm sm:rounded-2xl sm:border sm:border-neutral-200 sm:shadow-2xl sm:origin-bottom-right"
          >
          <header className="flex items-start justify-between gap-3 border-b border-neutral-100 bg-neutral-900 px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              {/* ai.png hitam solid — dirender sebagai mask putih (bg
                  currentColor di-mask bentuk PNG-nya) biar keliatan di
                  header gelap, gantiin ikon Bot dari lucide. Ukurannya
                  sengaja lebih gede (size-9) & di-center (items-center di
                  parent) biar sepadan sama tinggi blok teks dua baris di
                  sampingnya, bukan nempel rata atas kayak ikon kecil. */}
              <span
                className="size-9 shrink-0 bg-white"
                style={{
                  WebkitMaskImage: 'url(/ai.png)',
                  maskImage: 'url(/ai.png)',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                }}
                aria-hidden
              />
              <div>
                <h2 className="font-semibold">Asisten Antrean</h2>
                <p className="text-xs text-neutral-300">Tanya posisi dan skor laporan</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              // p-2.5 (44px) — di HP chat kebuka fullscreen dan tombol toggle
              // di bawah ke-hidden, jadi X ini SATU-SATUNYA jalan keluar.
              // Sebelumnya p-1 (28px), kekecilan buat jari.
              className="rounded-lg p-2.5 text-neutral-300 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
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
          </motion.section>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`pointer-events-auto absolute right-7 items-center gap-2 rounded-full bg-neutral-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-[bottom] duration-300 ease-out hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 sm:static sm:right-auto sm:ml-auto ${
          isOpen ? 'hidden sm:flex' : 'flex'
        } ${lifted ? 'bottom-[calc(min(72svh,42rem)+1.5rem)]' : 'bottom-4'}`}
        aria-expanded={isOpen}
        aria-controls="queue-assistant-question"
      >
        {isOpen ? <X className="size-5" aria-hidden /> : <MessageCircle className="size-5" aria-hidden />}
        <span>{isOpen ? 'Tutup chat' : 'Tanya asisten'}</span>
      </button>
    </div>
  )
}

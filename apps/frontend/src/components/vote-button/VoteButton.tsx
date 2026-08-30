import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, ThumbsUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ApiError, apiFetch } from '../../lib/api'
import { hasStoredSession } from '../../lib/auth'
import type { ReportListItem } from '../report-card'


interface VoteButtonProps {
  reportId: string
  votesCount: number
}

interface VoteResponse {
  report_id: string
  votes_count: number
}

//<---------- VoteButton ------------>
export default function VoteButton({ reportId, votesCount }: VoteButtonProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isSupported, setIsSupported] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const voteMutation = useMutation({
    mutationFn: () => apiFetch<VoteResponse>('/votes', { method: 'POST', body: JSON.stringify({ report_id: reportId }) }),
    onMutate: async () => {
      setErrorMessage(null)
      await queryClient.cancelQueries({ queryKey: ['report', reportId] })
      const previousReport = queryClient.getQueryData<ReportListItem>(['report', reportId])

      queryClient.setQueryData<ReportListItem>(['report', reportId], (current) =>
        current ? { ...current, votes_count: current.votes_count + 1 } : current,
      )

      return { previousReport }
    },
    onError: (error, _variables, context) => {
      if (context?.previousReport) queryClient.setQueryData(['report', reportId], context.previousReport)

      if (error instanceof ApiError && error.statusCode === 409) {
        setIsSupported(true)
        setErrorMessage('Anda sudah mendukung laporan ini.')
        return
      }

      if (error instanceof ApiError && error.statusCode === 401) {
        navigate(`/auth?redirect=${encodeURIComponent(`/laporan/${reportId}`)}`)
        return
      }

      setErrorMessage('Dukungan belum terkirim. Coba lagi sebentar lagi.')
    },
    onSuccess: (response) => {
      setIsSupported(true)
      queryClient.setQueryData<ReportListItem>(['report', reportId], (current) =>
        current ? { ...current, votes_count: response.votes_count } : current,
      )
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['report', reportId] })
      void queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
  })

  //<---------- handleVote ------------>
  function handleVote() {
    if (!hasStoredSession()) {
      navigate(`/auth?redirect=${encodeURIComponent(`/laporan/${reportId}`)}`)
      return
    }

    voteMutation.mutate()
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleVote}
        disabled={voteMutation.isPending || isSupported}
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed ${
          isSupported
            ? 'bg-emerald-100 text-emerald-800 focus:ring-emerald-400'
            : 'bg-neutral-900 text-white hover:bg-neutral-700 focus:ring-neutral-400 disabled:bg-neutral-400'
        }`}
      >
        {isSupported ? <Check className="size-4" aria-hidden /> : <ThumbsUp className="size-4" aria-hidden />}
        {voteMutation.isPending ? 'Mengirim dukungan…' : isSupported ? 'Sudah didukung' : 'Dukung laporan'}
        <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs">{votesCount}</span>
      </button>
      {errorMessage && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

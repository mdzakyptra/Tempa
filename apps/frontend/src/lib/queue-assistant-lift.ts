import { createContext, useContext, useEffect } from 'react'

const QueueAssistantLiftContext = createContext<(lifted: boolean) => void>(() => {})

export const QueueAssistantLiftProvider = QueueAssistantLiftContext.Provider

//<---------- useSetQueueAssistantLifted ------------>
export function useSetQueueAssistantLifted(lifted: boolean) {
  const setLifted = useContext(QueueAssistantLiftContext)

  useEffect(() => {
    setLifted(lifted)
    return () => setLifted(false)
  }, [lifted, setLifted])
}

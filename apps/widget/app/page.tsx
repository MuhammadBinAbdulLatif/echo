'use client'
import { Button } from "@workspace/ui/components/button"
import { useVapi } from '@/hooks/use-vapi'
export default function Page() {
  const { isSpeaking, isConnecting, isConnected, transcript, startCall, endCall } = useVapi()
  return (
    <div className="flex items-center justify-center min-h-svh max-w-md mx-auto w-full flex-col ">
     <Button onClick={()=> startCall()}>Start Call</Button>
     <Button onClick={()=> endCall()}>End Call</Button>
     <p>
      isConnected: {isConnected ? 'true': 'false'} <br/>
      isConnecting: {isConnecting ? 'true': 'false'} <br/>
      isSpeaking: {isSpeaking ? 'true': 'false'} <br/>
      {JSON.stringify(transcript, null, 2)}
     </p>
    </div>
  )
}

import Vapi from "@vapi-ai/web";
import { useEffect, useState } from "react";

interface TranscriptMessage {
    role: 'user' | 'assistant';
    text: string;
}

export const useVapi = ()=> {
    const [vapi, setVapi] =  useState<Vapi | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

    // The reason for using the state for the purpose of VAPI integration is because every user can bring their api keys
    useEffect(()=> {
        const vapiInstacne = new Vapi('9ad6cd98-9997-4829-a870-c6298a0b5684') // only for testing the VAPI api other wise customers will provider thier own api keys.
        setVapi(vapiInstacne);
        // good to know isn't it. If yes, please follow me on github
        vapiInstacne.on('call-start', ()=> {
            setIsConnected(true);
            setIsConnecting(false);
            setTranscript([])
        })
        vapiInstacne.on('call-end',()=> {
            setIsConnected(false);
            setIsConnecting(false);
            setIsSpeaking(false);
        })
        vapiInstacne.on('speech-start',()=> {
            setIsSpeaking(true);
        })
        vapiInstacne.on('speech-end',()=> {
            setIsSpeaking(false);
        })
        vapiInstacne.on('error',(error)=> {
            console.log(error)
            setIsConnecting(false);
        })
        vapiInstacne.on('message',(message)=> {
            if (message.type === 'transcript' && message.transcriptType === 'final') {
                setTranscript((prev) => [...prev, { role: message.role === 'user'? 'user': 'assistant', text: message.transcript }]);
            } 
        })
        return ()=> {
            vapiInstacne?.stop()
        }
    }, [])
    const startCall = ()=> {
        setIsConnecting(true);
       if(vapi) {
        vapi.start("0917cc7b-13dc-4e3f-ab1c-e406757de042");// only for testing the VAPI api other wise customers will provider thier own assistant ids which will be custom ones
       }


    }
    const endCall = ()=> {
        if(vapi){
            vapi.stop()
        }
    }
    return {
        isSpeaking, 
        isConnecting,
        isConnected,
        transcript,
        startCall,
        endCall
    }


}
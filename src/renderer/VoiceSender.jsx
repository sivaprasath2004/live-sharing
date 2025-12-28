import { useRef, useState } from "react";

export default function VoiceSender() {
  const wsRef = useRef(null);
  const audioCtxRef = useRef(null);
  const processorRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null); 
  const [streaming, setStreaming] = useState(false);

const startStreaming = async () => {
  wsRef.current = new WebSocket("ws://localhost:8899");
  wsRef.current.binaryType = "arraybuffer";

  wsRef.current.onopen = async () => {
    streamRef.current = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    audioCtxRef.current = new AudioContext({ sampleRate: 48000 });
    await audioCtxRef.current.resume();

    sourceRef.current =
      audioCtxRef.current.createMediaStreamSource(streamRef.current);

    processorRef.current =
      audioCtxRef.current.createScriptProcessor(4096, 1, 1);

    processorRef.current.onaudioprocess = (e) => {
      if (wsRef.current.readyState !== WebSocket.OPEN) return;

      const input = e.inputBuffer.getChannelData(0);
      const buffer = new ArrayBuffer(input.length * 2);
      const view = new DataView(buffer);

      for (let i = 0; i < input.length; i++) {
        let s = Math.max(-1, Math.min(1, input[i]));
        view.setInt16(i * 2, s * 0x7fff, true);
      }

      wsRef.current.send(buffer);
    };

    // ❌ DO NOT MONITOR MIC
    sourceRef.current.connect(processorRef.current);
    // processorRef.current.connect(audioCtxRef.current.destination);

    setStreaming(true);
  };
};


  const stopStreaming = () => {
    setStreaming(false);

    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();

    streamRef.current?.getTracks().forEach((t) => t.stop());

    audioCtxRef.current?.close();
    wsRef.current?.close();

    processorRef.current = null;
    sourceRef.current = null;
    audioCtxRef.current = null;
    wsRef.current = null;
  };

  return (
    <div>
      {!streaming ? (
        <button onClick={startStreaming}>🎙 Start Voice</button>
      ) : (
        <button onClick={stopStreaming}>⛔ Stop Voice</button>
      )}
    </div>
  );
}


let audioCtx = null;
let nextPlayTime = 0;

export function initAudioPlayer() {
   audioCtx = new AudioContext({ sampleRate: 48000 });
  nextPlayTime = audioCtx.currentTime;
}

export function playAudio(buffer) {
   if (!audioCtx) return;

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const int16 = new Int16Array(buffer);
  const float32 = new Float32Array(int16.length);

  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 32768;
  }

  const audioBuffer = audioCtx.createBuffer(
    1,
    float32.length,
    48000
  );

  audioBuffer.copyToChannel(float32, 0);

  const src = audioCtx.createBufferSource();
  src.buffer = audioBuffer;
  src.connect(audioCtx.destination);

  if (nextPlayTime < audioCtx.currentTime) {
    nextPlayTime = audioCtx.currentTime;
  }

  src.start(nextPlayTime);
  nextPlayTime += audioBuffer.duration;
}
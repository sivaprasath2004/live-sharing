import React, { useEffect, useRef } from "react";

export default function App() {
  const videoRef = useRef();
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8899");
    startScreenShare();
       window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);



  function handleKeyDown(e) {
    e.preventDefault();           // ✔ block default action
    e.stopPropagation();          // ✔ prevent browser handling

    const key = e.key;           // ex: "a", "Enter", "Control", "Escape"

    ws.current.send(
      JSON.stringify({
        type: "key-press",
        command: key,
      })
    );
  }

  async function startScreenShare() {
    const sourceId = await window.electron.ipcRenderer.getScreenStream();

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: sourceId
        }
      }
    });

    videoRef.current.srcObject = stream;
    videoRef.current.play();
  }

  function onMouseMove(e) {
    const rect = videoRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    ws.current.send(JSON.stringify({
      type: "mouse-move",
      x: relX,
      y: relY,
    }));
  }

  function onClick() {
    ws.current.send(JSON.stringify({ type: "mouse-click" }));
  }

  return (
    <div > 
      <video
        ref={videoRef}
        style={{ width: "100%", border: "2px solid black" }}
        onMouseMove={onMouseMove}
        onClick={onClick}
      />
    </div>
  );
}

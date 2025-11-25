import React, { useEffect, useRef,useState } from "react";
import Menu from "./Menu";
export  function App() {
  const videoRef = useRef();
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("wss://audience-attended-rely-capability.trycloudflare.com");
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
let lastClick = 0;
  function onClick() {
    const now = Date.now();
  if (now - lastClick < 150) return;  
  lastClick = now;

  ws.current.send(JSON.stringify({ type: "mouse-click" }));
  }
function sendClick(button) {
  if(button === "left"){

  }else{
  ws.current.send(JSON.stringify({
    type: button === "left" ? "mouse-left-click" : "mouse-right-click"
  }));
}
}
  return (
    <div style={{height:'100vh',backgroundColor:"#272727ce",width:'100vw',display:'flex',justifyContent:'center',alignItems:'center' }}> 
      <video
        ref={videoRef}
        style={{ maxWidth: "99.5%",maxHeight:"98vh", border: "2px solid black" }}
        onMouseMove={onMouseMove}
        onClick={()=>onClick()}
        onContextMenu={(e) => { 
        e.preventDefault();   // prevent browser menu
        sendClick("right");
      }}
      />
    </div>
  );
}


 const APPDefault=()=>{
  const [stage,setStage]=useState("Menu")
  return stage=="Menu"?<Menu />:<App />
  // return <App />
}

export default APPDefault
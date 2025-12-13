import React,{useState,useEffect, useRef} from 'react'
import DownloadButton from './Ui/Download.File.Button'
import {Button,Input} from 'antd'
import InputUi from './Ui/Input.Ui'
import "./App.css"
const Menu = () => {
  const [url,setURL]=useState(false)
  const websockets=useRef(null)
  const [menu,setMenu]=useState(false)
  const [useName,setUserName]=useState("")
  const [sessionCode,setSessionCode]=useState(false)

 const websocketConnection = (url) => {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket('ws://localhost:9999');

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'CREATE_SESSION',
        url
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'SESSION_CREATED') {
          resolve({
            ws,
            code: data.code
          });
        }

        if (data.type === 'ERROR') {
          reject(data.message);
          ws.close();
        }

      } catch (err) {
        reject('Invalid server response');
        ws.close();
      }
    };

    ws.onerror = () => {
      reject('WebSocket connection failed');
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
    };
  });
};


  const getURLS=async()=>{
    const urls=await  window.electron.ipcRenderer.getScreenURL() 
    const { ws, code } =await websocketConnection(urls)
    setSessionCode(code)
    setURL(urls)
  }

  useEffect(()=>{
    websocketConnection()
    getURLS()
  },[])
  
  return (
    <div style={{display:'flex',alignItems:'center',height:'100vh'}}>
     <div style={{background:"#f0453c",width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}>
        <h1 style={{color:"#fff7fa", fontFamily:"Inter",fontWeight:"bold"}}>Zynk</h1>
        <div   style={{display:'flex',flexDirection:'column',gap:"1rem",justifyContent:'center',alignItems:'center',height:'100vh'}}>
          {menu==="1ST"?<div style={{maxWidth:"80%",width:'100%'}}>
             <div style={{width:'100%',padding:'0.8',display:'flex',justifyContent:'center',borderRadius:'0.625rem ',background:"#fff",border:'1px solid #e6ebf1',alignItems:'center',gap:"1rem"}}>
              {sessionCode.split("").map(e=>(
                <p style={{margin:"0px",fontSize:'1.8rem',fontWeight:"bold"}}>
                  {e}
                </p>
              ))}
              </div>
             <Input style={{width:'100%'}} onChange={(e)=>setUserName(e.target.value)} value={useName} placeholder={"User Name"} />
          </div>:
          <>
          <Button  style={{width:"240px"}} onClick={()=>{
            setMenu("1ST")
          }}>
             Create Session
          </Button>
          {/* <DownloadButton /> */}
          <Button style={{width:"240px"}} onClick={()=>{
            setMenu("2ND")
          }}>
            Join Session 
          </Button>
          </>}
        </div>
      </div>
    </div>
  )
}

export default Menu
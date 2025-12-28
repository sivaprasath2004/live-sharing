import React, { useState } from 'react'
import { IoChatboxEllipsesSharp } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";
import { Button, Popover,Input } from 'antd';
import { IoMdSend } from "react-icons/io";
import "./Chat.css"
const Chat = () => {
    const [state,setState]=useState(false)
    const onChangeButton=async()=>{
        let height
        let width
        if(!state){
         height=500
           width=500
        }else{
             height=70
           width=70
        }
        console.log({
            height,width
        }) 
        if(!state){
             window.electron.ipcRenderer.setScreenSize(height,width);
        setTimeout(()=>{
        setState(!state)
        },200) 
    }else{
        setState(!state) 
        setTimeout(()=>{
             window.electron.ipcRenderer.setScreenSize(height,width);
        },300)
    }
    }
  return (
    <div className='drag-box' style={{display:'flex',height:'100vh',justifyContent: 'flex-end',alignItems:"flex-end"}} >
     <Popover content={
       <div style={{minWidth:'250px',minHeight:"350px",border:"1px solid #e6ebf1",borderRadius:"0.25rem",overflow:"hidden"}}>
        <header style={{padding:"0.5rem 1rem", boxShadow:'0 0.5rem 1rem rgba(0, 0, 0, 0.03)',display:'flex',justifyContent:'space-between',alignItems:'center',background:"#00a2ea"}}>
            <p style={{margin:0,fontFamily:"Inter",fontWeight:"480",color:'#fff',fontSize:"12px" }}>Zynk </p>
            <button style={{border:"0px",position:'relative',top:"0.2rem",background:'transparent',padding:"0px",margin:"0px"}}><IoIosCloseCircle size={20} color='#fff' /></button>
        </header>
        <div style={{height:"280px" ,width:'100%',padding:"5px 0px",overflowY:'scroll'}}>
        <div style={{margin:"0px 5px",background:'red'}}>
 <h1>JJjj</h1>
           <h1>JJjj</h1>
             <h1>JJjj</h1>

               <h1>JJjj</h1>
                 <h1>JJjj</h1>  <h1>JJjj</h1>  <h1>JJjj</h1>


                   <h1>JJjj</h1>
                     <h1>JJjj</h1>
                       <h1>JJjj</h1>
                         <h1>JJjj</h1>

                           <h1>JJjj</h1>
                             <h1>JJjj</h1>
        </div>
        </div>
        <div style={{height:"40px",padding:"0px",width:"97%",margin:"0 auto",display:'flex',justifyContent:'center',alignItems:'center',gap:'5px'}}>
          <Input style={{width:"85%"}} placeholder="Message" variant="filled" />
          <Button disabled={true} style={{background:"#00a2ea",display:'flex',padding:"0px",border:"0px",justifyContent:'center',alignItems:'center',height:"35px",width:"35px",borderRadius:"50%" }}>
            <div style={{position:'relative',right:"-0.1rem",top:"0.15rem",margin:"0px"}}><IoMdSend size={20} color='#fff' /></div>
          </Button>
        </div>
       </div>
     }
     open={state}
     trigger={"click"} 
     >
        <div className='dragger' style={{background:"#fff",height:50,width:50,borderRadius:"50%",display:'flex',justifyContent:'center',alignItems:'center'}}>
       <div className='dragger-before'></div>
        <Button onClick={onChangeButton} style={{background:"#fff",height:40,width:40,borderRadius:"50%",padding:"0px",margin:"0px",display:"flex",justifyContent:'center',alignItems:'center'}}>
            <IoChatboxEllipsesSharp size={22} color='#000' />
        </Button> 
        </div>
     </Popover>
     </div>
  )
}

export default Chat
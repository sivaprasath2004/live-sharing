import React,{useState,useEffect} from 'react'
import DownloadButton from './Ui/Download.File.Button'
import {Button,Input} from 'antd'
const Menu = () => {
  const [url,setURL]=useState(false)
  const [menu,setMenu]=useState(false)
  const [useName,setUserName]=useState(false)
  const getURLS=async()=>{
    const urls=await  window.electron.ipcRenderer.getScreenURL()
    setURL(urls)
  }

  useEffect(()=>{
    getURLS()
  },[])
  
  return (
    <div style={{display:'flex',alignItems:'center',height:'100vh'}}>
      <div style={{background:'red',width:'50%',height:'100%'}}></div>
      <div style={{background:"white",width:'50%',height:'100%',justifyContent:'center',alignItems:'center'}}>
        <div   style={{display:'flex',flexDirection:'column',gap:"1rem",justifyContent:'center',alignItems:'center',height:'100vh'}}>
          {menu==="1ST"?<>
             <Input onChange={(e)=>setUserName(e.target.value)} value={useName} />
          </>:
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
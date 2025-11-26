import React from 'react'
import DownloadButton from './Ui/Download.File.Button'
import {Button} from 'antd'
const Menu = () => {
  return (
    <div style={{display:'flex',alignItems:'center',height:'100vh'}}>
      <div style={{background:'red',width:'50%',height:'100%'}}></div>
      <div style={{background:"white",width:'50%',height:'100%',justifyContent:'center',alignItems:'center'}}>
        <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
          <Button>
             Create Session
          </Button>
          <DownloadButton />
          <Button>
            Join Session 
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Menu
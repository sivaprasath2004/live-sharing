const startTunnel=require("./cloudflareModule")
const run=async()=>{
  try {
    const url = await startTunnel('D:\\New Project\\electron-react-boilerplate\\CloudFared\\cloudflared-windows-386.exe', 8899);
    console.log("Tunnel URL:", url);
  } catch (e) {
    console.error("Error:", e);
  }
} 

run()
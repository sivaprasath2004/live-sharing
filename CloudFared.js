const { spawn } = require("child_process");
const path=require("path")
let url
const cloudFarePath=path.join(__dirname,"CloudFared","cloudflared-windows-386.exe")
const cloud = spawn(cloudFarePath, ["tunnel", "--url", "http://localhost:8899"]);
const urlRegex = /(https?:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com)/;
cloud.stdout.on("data", (data) => {
    if(!url){
  const text = data.toString();
  const match = text.match(urlRegex);
  if (match) {
    url=match[0]
    console.log("Detected Tunnel URL:", url);
  }
}
});

cloud.stderr.on("data", (data) => {
     if(!url){
    const text = data.toString();
  const match = text.match(urlRegex);
  if (match) {
     url=match[0]
    console.log("Detected Tunnel URL:", match[0]);
  }
}
});

const { spawn } = require("child_process");

module.exports = function startCloudflareTunnel(cloudflarePath, port = 8899) {
  return new Promise((resolve, reject) => {
    let tunnelUrl = null;
    const urlRegex = /(https?:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com)/;

    const cloud = spawn(cloudflarePath, [
      "tunnel",
      "--url",
      `http://localhost:${port}`
    ]);

    const handleOutput = (data) => {
      console.log("COMING")
      const text = data.toString();
      const match = text.match(urlRegex);
      if (match && !tunnelUrl) {
        tunnelUrl = match[0];
        console.log({
          tunnelUrl
        })
        resolve(tunnelUrl);
      }
    };

    cloud.stdout.on("data", handleOutput);
    cloud.stderr.on("data", handleOutput);

    cloud.on("error", (err) => reject(err));

    cloud.on("exit", (code) => {
      if (!tunnelUrl) reject(new Error("Cloudflare tunnel exited before URL was detected."));
    });
  });
};


// const { spawn } = require("child_process");
// const path=require("path")
// let url
// const cloudFarePath=path.join(__dirname,"CloudFared","cloudflared-windows-386.exe")
// const cloud = spawn(cloudFarePath, ["tunnel", "--url", "http://localhost:8899"]);
// const urlRegex = /(https?:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com)/;
// cloud.stdout.on("data", (data) => {
//     if(!url){
//   const text = data.toString();
//   const match = text.match(urlRegex);
//   if (match) {
//     url=match[0]
//     console.log("Detected Tunnel URL:", url);
//   }
// }
// });

// cloud.stderr.on("data", (data) => {
//      if(!url){
//     const text = data.toString();
//   const match = text.match(urlRegex);
//   if (match) {
//      url=match[0]
//     console.log("Detected Tunnel URL:", match[0]);
//   }
// }
// });

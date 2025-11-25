// const { spawn } = require('child_process');
// const WebSocket = require('ws');
// const wss = new WebSocket.Server({ port: 4000 });

// const ffmpegArgs = [
//   "-f", "gdigrab",
//   "-framerate", "25",
//   "-i", "desktop",
//   "-an",
//   "-c:v", "libx264",
//   "-preset", "ultrafast",
//   "-tune", "zerolatency",
//   "-pix_fmt", "yuv420p",
//   "-g", "30",
//   "-keyint_min", "15",
//   "-x264-params", "scenecut=0:ref=1",
//   "-f", "mp4",
//   "-movflags", "frag_keyframe+empty_moov+default_base_moof+faststart",
//   "-"
// ];

// console.log("Spawning ffmpeg:", ffmpegArgs.join(' '));
// const ffmpeg = spawn('ffmpeg', ffmpegArgs, { stdio: ['ignore', 'pipe', 'pipe'] });
// ffmpeg.stderr.on('data', d => process.stdout.write('[ffmpeg] ' + d.toString()));

// const clients = new Set();
// wss.on('connection', (ws) => {
//   ws.binaryType = 'nodebuffer';
//   clients.add(ws);
//   ws.on('close', () => clients.delete(ws));
//   ws.on('message', (msg) => {
//     try {
//       const j = JSON.parse(msg.toString());
//       // handle control messages...
//     } catch(e){}
//   });
// });

// ffmpeg.stdout.on('data', (chunk) => {
//   for (const ws of clients) {
//     if (ws.readyState !== WebSocket.OPEN) continue;
//     // backpressure protection:
//     if (ws.bufferedAmount > 500_000) continue; // drop if too far behind
//     ws.send(chunk);
//   }
// });


var robot = require("@jitsi/robotjs");

// Speed up the mouse.
robot.setMouseDelay(2);

var twoPI = Math.PI * 2.0;
var screenSize = robot.getScreenSize();
var height = (screenSize.height / 2) - 10;
var width = screenSize.width;

robot.moveMouse(11.5,984);
let robot;
const { exec } = require("child_process");
try {
  robot = require("@jitsi/robotjs");   // NEW WORKING PACKAGE
} catch (err) {
  console.error("RobotJS failed to load:", err);
  process.send({ error: "robot-load-failed" });
  process.exit(1);
}

process.on("message", (msg) => {
  if (!msg) return;

 if (msg.type === "key") {
    console.log("Received key:", msg.command);

    // Convert common keys to CMD-friendly commands
    const key = msg.command;

    // Example: typing the key in cmd
    if (key.length === 1) {
      exec(`echo ${key}`, (err, stdout) => {
        if (err) console.error("CMD error:", err);
        else console.log("CMD output:", stdout);
      });
    }

    // Example: handle Enter command
    if (key === "Enter") {
      exec(`echo Executed Enter key`, (err, stdout) => {
        if (err) console.error(err);
        else console.log(stdout);
      });
    }

    // Add more…
    if (key === "Escape") {
      exec("echo ESC pressed", () => {});
    }
  }


  if (msg.type === "move") {
    try {
   const screen = robot.getScreenSize();

    // Convert relative (0–1) to actual screen pixels
    const posX = Math.floor(msg.x * screen.width);
    const posY = Math.floor(msg.y * screen.height);

    robot.moveMouse(posX, posY);
    } catch (err) {
      console.error("Mouse move error:", err);
    }
  }
  if (msg.type === "left-click") {
    robot.mouseClick("left");
  }

  if (msg.type === "right-click") {
    robot.mouseClick("right");
  }
  if (msg.type === "click") {
    try {
      robot.mouseClick();
    } catch (err) {}
  }
});

process.on("disconnect", () => {
  process.exit(0);
});
 
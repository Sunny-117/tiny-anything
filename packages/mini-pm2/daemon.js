// 守护进程管理器
const { fork } = require("child_process");

const script = process.argv[2];
if (!script) {
    console.error("daemon.js 缺少要运行的脚本参数");
    process.exit(1);
}

function startWorker() {
    const worker = fork(script, [], { stdio: "inherit" });
    console.log(`[daemon] 启动 worker，pid=${worker.pid}`);

    worker.on("exit", (code) => {
        console.log(`[daemon] worker(${worker.pid}) 退出，code=${code}，重启中...`);
        startWorker();
    });
}

startWorker();

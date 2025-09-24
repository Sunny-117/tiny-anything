#!/usr/bin/env node

const { spawn, fork } = require("child_process");
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.resolve(__dirname, "mini-pm2.json");

// 读取进程记录
function loadData() {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

// 保存进程记录
function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// 启动守护进程
function start(script) {
    const out = fs.openSync("./out.log", "a");
    const err = fs.openSync("./err.log", "a");

    const daemon = spawn("node", [path.resolve(__dirname, "daemon.js"), script], {
        detached: true,
        stdio: ["ignore", out, err]
    });

    daemon.unref();

    const data = loadData();
    data.push({ pid: daemon.pid, script, startedAt: new Date().toISOString() });
    saveData(data);

    console.log(`🚀 已启动守护进程，PID=${daemon.pid}, 运行脚本=${script}`);
}

// 查看列表
function list() {
    const data = loadData();
    console.log("=== mini-pm2 进程列表 ===");
    data.forEach(p => {
        console.log(`PID=${p.pid}  SCRIPT=${p.script}  STARTED=${p.startedAt}`);
    });
    if (data.length === 0) console.log("(空)");
}

// 停止进程
function stop(pid) {
    try {
        process.kill(pid, "SIGTERM");
        let data = loadData();
        data = data.filter(p => p.pid !== Number(pid));
        saveData(data);
        console.log(`🛑 已停止进程 PID=${pid}`);
    } catch (err) {
        console.error(`停止失败: ${err.message}`);
    }
}

// CLI 参数解析
const [,, cmd, arg] = process.argv;

if (cmd === "start") {
    if (!arg) {
        console.error("❌ 请指定要启动的脚本");
        process.exit(1);
    }
    start(arg);
}
else if (cmd === "list") {
    list();
}
else if (cmd === "stop") {
    if (!arg) {
        console.error("❌ 请指定要停止的 PID");
        process.exit(1);
    }
    stop(arg);
}
else {
    console.log(`用法: 
  node mini-pm2.js start <script>
  node mini-pm2.js list
  node mini-pm2.js stop <pid>`);
}

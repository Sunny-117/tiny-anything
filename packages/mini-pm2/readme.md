# mini-pm2，包含最核心的功能：

start：后台启动并守护一个脚本

list：查看正在运行的进程

stop：停止指定进程

# 启动
node mini-pm2.js start worker.js

# 查看进程列表
node mini-pm2.js list
# === mini-pm2 进程列表 ===
# PID=12345  SCRIPT=worker.js  STARTED=2025-09-24T03:00:00.000Z

# 停止
node mini-pm2.js stop 12345


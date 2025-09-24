// 模拟业务进程
console.log(`[worker] 运行中，pid=${process.pid}`);

setInterval(() => {
    if (Math.random() < 0.3) {
        console.log(`[worker] 崩溃退出...`);
        process.exit(1);
    } else {
        console.log(`[worker] 正常运行...`);
    }
}, 2000);

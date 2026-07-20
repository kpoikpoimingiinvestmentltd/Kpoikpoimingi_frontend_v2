import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dist = join(root, "dist");

if (!existsSync(dist)) {
	console.error("Missing dist/ folder. Run `npm run build` before start.");
	process.exit(1);
}

const port = String(process.env.PORT || 3000).trim();
if (!/^\d+$/.test(port)) {
	console.error(`Invalid PORT: ${JSON.stringify(process.env.PORT)}`);
	process.exit(1);
}

// serve@14 requires an explicit URI scheme; Railway's HOST env breaks bare -l values
const listen = `tcp://0.0.0.0:${port}`;
const serveBin = join(root, "node_modules", "serve", "build", "main.js");

const env = { ...process.env };
delete env.HOST;

const child = spawn(process.execPath, [serveBin, "-s", "dist", "-l", listen], {
	cwd: root,
	stdio: "inherit",
	env,
});

child.on("exit", (code, signal) => {
	if (signal) {
		process.kill(process.pid, signal);
		return;
	}
	process.exit(code ?? 1);
});

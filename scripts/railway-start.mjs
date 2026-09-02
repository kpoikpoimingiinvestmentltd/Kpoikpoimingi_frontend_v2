import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dist = join(root, "dist");

function run(command, args) {
	return new Promise((resolve, reject) => {
		const child = spawn(command, args, {
			cwd: root,
			stdio: "inherit",
			env: process.env,
			shell: process.platform === "win32",
		});
		child.on("exit", (code, signal) => {
			if (signal) {
				reject(new Error(`killed by ${signal}`));
				return;
			}
			if (code !== 0) {
				reject(new Error(`${command} ${args.join(" ")} exited ${code}`));
				return;
			}
			resolve();
		});
	});
}

async function main() {
	if (!existsSync(dist)) {
		console.log("dist/ missing — running npm run build...");
		await run("npm", ["run", "build"]);
	}

	if (!existsSync(dist)) {
		console.error("Build finished but dist/ is still missing.");
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
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});

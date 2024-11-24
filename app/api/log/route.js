import fs from "fs/promises";
import path from "path";

const LOG_FILE = path.join(process.cwd(), "data", "resource-logs.json");

export async function GET() {
  try {
    const data = await fs.readFile(LOG_FILE, "utf8");
    return Response.json(JSON.parse(data));
  } catch (error) {
    if (error.code === "ENOENT") {
      return Response.json([]);
    }
    console.error("Error reading log file:", error);
    return Response.json({ error: "Failed to read logs" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const newLog = await request.json();
    let logs = [];
    try {
      const data = await fs.readFile(LOG_FILE, "utf8");
      logs = JSON.parse(data);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
    logs.push({ ...newLog, timestamp: new Date().toISOString() });
    if (logs.length > 1000) {
      logs = logs.slice(-1000);
    }
    await fs.writeFile(LOG_FILE, JSON.stringify(logs, null, 2));
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error writing to log file:", error);
    return Response.json({ error: "Failed to write log" }, { status: 500 });
  }
}

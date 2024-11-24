import { exec } from 'child_process';
import { promisify } from 'util';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);
const DB_PATH = path.join(process.cwd(), 'data', 'resource-logs.db');

async function ensureDataDir() {
  const dataDir = path.dirname(DB_PATH);
  try {
    await fs.access(dataDir);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(dataDir, { recursive: true });
    } else {
      throw error;
    }
  }
}

async function getDb() {
  await ensureDataDir();
  return open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });
}

async function initDb() {
  const db = await getDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS resource_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT,
      type TEXT,
      cpu REAL,
      ram REAL,
      disk REAL,
      usage REAL
    )
  `);
  await db.close();
}

async function logData(data) {
  const db = await getDb();
  const { type, cpu, ram, disk, usage } = data;
  await db.run(
      'INSERT INTO resource_logs (timestamp, type, cpu, ram, disk, usage) VALUES (?, ?, ?, ?, ?, ?)',
      [new Date().toISOString(), type, cpu, ram, disk, usage]
  );
  await db.close();
}

async function executeCommand(command) {
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      console.error(`Command stderr: ${stderr}`);
    }
    return parseFloat(stdout.trim()).toFixed(2);
  } catch (error) {
    console.error(`Error executing command: ${command}`, error);
    throw new Error(`Failed to execute command: ${command}. Error: ${error.message}`);
  }
}

async function getCPUUsage() {
  return executeCommand("top -bn1 | grep 'Cpu(s)' | awk '{print $2 + $4}'");
}

async function getRAMUsage() {
  return executeCommand("free | awk '/Mem:/ {print $3/$2 * 100.0}'");
}

async function getDiskUsage() {
  return executeCommand("df -h / | awk 'NR==2 {print $5}' | sed 's/%//'");
}

async function getServiceUsage(serviceName) {
  return executeCommand(`ps aux | grep ${serviceName} | grep -v grep | awk '{sum+=$3} END {print sum}'`);
}

export async function GET(request) {
  await initDb();
  const { searchParams } = new URL(request.url);
  const resourceType = searchParams.get('type');

  try {
    let data;
    switch (resourceType) {
      case 'system':
        data = {
          cpu: await getCPUUsage(),
          ram: await getRAMUsage(),
          disk: await getDiskUsage(),
        };
        break;
      case 'nginx':
      case 'fpm':
      case 'redis':
      case 'mysql':
        data = { usage: await getServiceUsage(resourceType) };
        break;
      default:
        console.error(`Invalid resource type: ${resourceType}`);
        return Response.json({ error: 'Invalid resource type' }, { status: 400 });
    }

    console.log(`Resource usage data for ${resourceType}:`, data);

    // Log the data
    await logData({ type: resourceType, ...data });

    return Response.json(data);
  } catch (error) {
    console.error('Error fetching resource usage:', error);
    return Response.json({ error: 'Failed to fetch resource usage', details: error.message }, { status: 500 });
  }
}


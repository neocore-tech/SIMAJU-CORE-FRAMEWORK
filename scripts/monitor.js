#!/usr/bin/env node
'use strict';

const blessed = require('blessed');
const contrib = require('blessed-contrib');
const { spawn } = require('child_process');
const pidusage = require('pidusage');
const si = require('systeminformation');
const path = require('path');

// ── 1. Setup Blessed Screen ──────────────────────────────────────────
const screen = blessed.screen({
  smartCSR: true,
  title: 'Simaju Process Manager'
});

// Grid Layout
const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });

// ── 2. Setup Widgets ────────────────────────────────────────────────
// CPU Line Chart (Top Left)
const cpuLine = grid.set(0, 0, 4, 6, contrib.line, {
  style: { line: 'yellow', text: 'green', baseline: 'black' },
  xLabelPadding: 3,
  xPadding: 5,
  showLegend: true,
  wholeNumbersOnly: false,
  label: 'CPU Usage (%)'
});

// RAM Line Chart (Top Right)
const ramLine = grid.set(0, 6, 4, 6, contrib.line, {
  style: { line: 'magenta', text: 'green', baseline: 'black' },
  xLabelPadding: 3,
  xPadding: 5,
  showLegend: true,
  wholeNumbersOnly: false,
  label: 'RAM Usage (MB)'
});

// Network Line Chart (Middle Left)
const netLine = grid.set(4, 0, 4, 6, contrib.line, {
  style: { line: 'cyan', text: 'green', baseline: 'black' },
  xLabelPadding: 3,
  xPadding: 5,
  showLegend: true,
  wholeNumbersOnly: false,
  label: 'Network Traffic (KB/s)'
});

// Ping & Memory Donut (Middle Right)
const systemDonut = grid.set(4, 6, 4, 6, contrib.donut, {
  label: 'System Health',
  radius: 6,
  arcWidth: 2,
  remainColor: 'black',
  yPadding: 2
});

// Log Box (Bottom)
const logBox = grid.set(8, 0, 4, 12, contrib.log, {
  fg: 'green',
  selectedFg: 'green',
  label: 'Simaju Server Logs (Press Q or Ctrl+C to exit)'
});

// Initialize with some empty data to force initial render
cpuLine.setData([{ title: 'CPU %', x: [], y: [] }]);
ramLine.setData([{ title: 'RAM MB', x: [], y: [] }]);
netLine.setData([{ title: 'Rx KB/s', x: [], y: [] }, { title: 'Tx KB/s', x: [], y: [] }]);
systemDonut.setData([
  { percent: 0, label: 'Sys Mem', color: 'magenta' },
  { percent: 0, label: `Ping Load`, color: 'cyan' }
]);

// ── 3. Data Storage for Charts ──────────────────────────────────────
const cpuData = { title: 'CPU %', x: [], y: [] };
const ramData = { title: 'RAM MB', x: [], y: [] };
const rxData  = { title: 'Rx KB/s', x: [], y: [], style: { line: 'cyan' } };
const txData  = { title: 'Tx KB/s', x: [], y: [], style: { line: 'red' } };

// Helper to keep only last 30 points
function pushData(dataObj, val) {
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  dataObj.x.push(time);
  dataObj.y.push(val);
  if (dataObj.x.length > 30) {
    dataObj.x.shift();
    dataObj.y.shift();
  }
}

// ── 4. Spawn Server ──────────────────────────────────────────────────
const indexPath = path.join(__dirname, '../index.js');
const serverProcess = spawn('node', [indexPath], {
  env: { ...process.env, NODE_ENV: 'development', COLOR: 1 },
  cwd: path.join(__dirname, '..')
});

serverProcess.stdout.on('data', (data) => {
  const lines = data.toString().split('\n');
  lines.forEach(line => {
    if (line.trim()) logBox.log(line);
  });
});

serverProcess.stderr.on('data', (data) => {
  const lines = data.toString().split('\n');
  lines.forEach(line => {
    if (line.trim()) logBox.log(`{red-fg}${line}{/red-fg}`);
  });
});

serverProcess.on('exit', (code) => {
  logBox.log(`{red-bg}{white-fg} ⚠️ SERVER STOPPED / CRASHED (Code: ${code}) ⚠️ {/white-fg}{/red-bg}`);
  logBox.log(`{yellow-fg}If the charts are empty, it means Port 3000 is still used by another terminal. Please kill the old terminal!{/yellow-fg}`);
});

// ── 5. Telemetry Polling ─────────────────────────────────────────────
let defaultIface = '';
si.networkInterfaceDefault().then(iface => defaultIface = iface).catch(() => {});

setInterval(async () => {
  // 1. CPU & RAM (Pidusage)
  try {
    if (serverProcess.pid) {
      const stats = await pidusage(serverProcess.pid);
      pushData(cpuData, parseFloat(stats.cpu.toFixed(1)));
      pushData(ramData, parseFloat((stats.memory / 1024 / 1024).toFixed(1)));
      
      cpuLine.setData([cpuData]);
      ramLine.setData([ramData]);
    }
  } catch (err) {
    // Ignore
  }

  // 2. Network (Rx/Tx)
  try {
    const netStats = await si.networkStats(defaultIface);
    if (netStats && netStats.length > 0) {
      const rxSec = netStats[0].rx_sec || 0;
      const txSec = netStats[0].tx_sec || 0;
      pushData(rxData, parseFloat((rxSec / 1024).toFixed(1)));
      pushData(txData, parseFloat((txSec / 1024).toFixed(1)));
      netLine.setData([rxData, txData]);
    }
  } catch (err) {
    // Ignore
  }

  // 3. Ping & System Memory
  try {
    let inet = 0;
    try {
      inet = await Promise.race([
        si.inetLatency(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 800))
      ]);
    } catch(e) {
      inet = 0; // fallback if blocked/timeout
    }
    
    const mem = await si.mem();
    
    const pingMs = Math.min(inet, 500); // cap to 500ms for visual
    const pingPercent = Math.min((pingMs / 500) * 100, 100);
    const memPercent = (mem.active / mem.total) * 100;

    systemDonut.setData([
      { percent: parseFloat(memPercent.toFixed(1)), label: 'Sys Mem', color: 'magenta' },
      { percent: parseFloat(pingPercent.toFixed(1)), label: inet === 0 ? 'Ping ERR' : `Ping ${inet.toFixed(0)}ms`, color: 'cyan' }
    ]);
  } catch (err) {
    // Ignore
  }

  screen.render();
}, 1000);

// ── 6. Key Bindings ──────────────────────────────────────────────────
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  if (serverProcess) {
    serverProcess.kill();
  }
  return process.exit(0);
});

// Render the initial screen
screen.render();

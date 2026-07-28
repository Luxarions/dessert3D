// AutoUpdate.js - Monitors file changes and auto-restarts the server
const chokidar = require('chokidar');
const { spawn } = require('child_process');
const path = require('path');

let serverProcess = null;
let isRestarting = false;
const WATCH_PATHS = ['./src', './routes', './controllers', './models', './services', './utils', './test'];
const IGNORED_PATHS = ['node_modules', '.git', 'logs', 'uploads', 'temp'];

function startServer() {
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
    console.log('🛑 Previous server process terminated');
  }

  console.log('🚀 Starting server...');
  serverProcess = spawn('node', ['server.js'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'development' }
  });

  serverProcess.on('error', (error) => {
    console.error('❌ Server process error:', error.message);
  });

  serverProcess.on('exit', (code, signal) => {
    console.log(`📌 Server exited with code ${code}, signal ${signal}`);
    if (!isRestarting && code !== 0) {
      console.log('⏳ Server crashed. Restarting in 2 seconds...');
      setTimeout(startServer, 2000);
    }
  });

  return serverProcess;
}

function handleFileChange(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  console.log(`📝 File changed: ${relativePath}`);
  
  if (!isRestarting) {
    isRestarting = true;
    console.log('🔄 Restarting server due to file changes...');
    
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
    }
    
    setTimeout(() => {
      isRestarting = false;
      startServer();
    }, 500);
  }
}

function handleFileAdd(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  console.log(`➕ New file added: ${relativePath}`);
  
  if (!isRestarting) {
    isRestarting = true;
    console.log('🔄 Restarting server to load new file...');
    
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
    }
    
    setTimeout(() => {
      isRestarting = false;
      startServer();
    }, 500);
  }
}

function handleFileUnlink(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  console.log(`🗑️ File removed: ${relativePath}`);
  
  if (!isRestarting) {
    isRestarting = true;
    console.log('🔄 Restarting server after file removal...');
    
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
    }
    
    setTimeout(() => {
      isRestarting = false;
      startServer();
    }, 500);
  }
}

function initializeWatcher() {
  console.log('👁️ Initializing file watcher...');
  console.log(`📂 Watching directories: ${WATCH_PATHS.join(', ')}`);
  console.log(`🚫 Ignoring: ${IGNORED_PATHS.join(', ')}`);

  const watcher = chokidar.watch(WATCH_PATHS, {
    ignored: (path) => {
      return IGNORED_PATHS.some(ignore => path.includes(ignore));
    },
    persistent: true,
    ignoreInitial: true,
    followSymlinks: false,
    usePolling: false,
    interval: 100,
    binaryInterval: 300,
    depth: 10,
    awaitWriteFinish: {
      stabilityThreshold: 200,
      pollInterval: 100
    }
  });

  watcher
    .on('add', handleFileAdd)
    .on('change', handleFileChange)
    .on('unlink', handleFileUnlink)
    .on('error', (error) => {
      console.error('⚠️ Watcher error:', error.message);
    })
    .on('ready', () => {
      console.log('✅ File watcher is ready and monitoring changes');
    });

  return watcher;
}

function setupGracefulShutdown(watcher) {
  const shutdown = () => {
    console.log('\n🛑 Shutting down gracefully...');
    
    if (watcher) {
      watcher.close();
      console.log('👁️ File watcher closed');
    }
    
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
      console.log('🛑 Server process terminated');
    }
    
    console.log('👋 Goodbye!');
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught exception:', error.message);
    console.error(error.stack);
  });
  process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled rejection at:', promise);
    console.error('💥 Reason:', reason);
  });
}

function startAutoUpdate() {
  console.log('═══════════════════════════════════════');
  console.log('🔄 AutoUpdate.js - File Monitor & Restart');
  console.log('═══════════════════════════════════════');
  console.log(`📅 Started at: ${new Date().toLocaleString()}`);
  console.log(`📂 Working directory: ${process.cwd()}`);
  console.log('═══════════════════════════════════════\n');

  const watcher = initializeWatcher();
  setupGracefulShutdown(watcher);
  startServer();

  console.log('\n✅ AutoUpdate is running!');
  console.log('💡 Press Ctrl+C to stop\n');
}

if (require.main === module) {
  startAutoUpdate();
} else {
  module.exports = { startAutoUpdate, startServer, initializeWatcher };
}

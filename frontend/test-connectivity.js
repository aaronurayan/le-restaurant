/**
 * Frontend-Backend Connectivity Test Script
 * 
 * This script tests the connectivity between the frontend and backend
 * by checking various endpoints and configurations.
 * 
 * Usage: node test-connectivity.js
 */

const http = require('http');

// Configuration
const BACKEND_PORT = 8080;
const BACKEND_HOST = 'localhost';
const FRONTEND_PORT = 5173;
const FRONTEND_HOST = 'localhost';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Test results
const results = {
  backend: {
    running: false,
    health: false,
    endpoints: [],
  },
  frontend: {
    running: false,
    proxy: false,
  },
  cors: {
    configured: false,
    details: null,
  },
  connectivity: {
    overall: 'unknown',
    issues: [],
  },
};

/**
 * Make HTTP request
 */
function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

/**
 * Test backend health endpoint
 */
async function testBackendHealth() {
  console.log('\n' + colors.cyan + 'Testing Backend Health...' + colors.reset);
  
  try {
    const response = await makeRequest({
      hostname: BACKEND_HOST,
      port: BACKEND_PORT,
      path: '/api/health',
      method: 'GET',
    });

    results.backend.health = response.statusCode === 200;
    console.log(
      response.statusCode === 200
        ? colors.green + '✅ Backend health check: PASSED' + colors.reset
        : colors.red + `❌ Backend health check: FAILED (Status: ${response.statusCode})` + colors.reset
    );
    return response.statusCode === 200;
  } catch (error) {
    results.backend.health = false;
    console.log(colors.red + `❌ Backend health check: FAILED (${error.message})` + colors.reset);
    return false;
  }
}

/**
 * Test backend endpoints
 */
async function testBackendEndpoints() {
  console.log('\n' + colors.cyan + 'Testing Backend Endpoints...' + colors.reset);
  
  const endpoints = [
    { path: '/api/health', method: 'GET', name: 'Health Check' },
    { path: '/api/menu-items', method: 'GET', name: 'Menu Items' },
    { path: '/api/users', method: 'GET', name: 'Users' },
    { path: '/api/orders', method: 'GET', name: 'Orders' },
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest({
        hostname: BACKEND_HOST,
        port: BACKEND_PORT,
        path: endpoint.path,
        method: endpoint.method,
      });

      const success = response.statusCode < 400;
      results.backend.endpoints.push({
        name: endpoint.name,
        path: endpoint.path,
        status: success ? 'success' : 'failed',
        statusCode: response.statusCode,
      });

      console.log(
        success
          ? colors.green + `✅ ${endpoint.name}: PASSED (${response.statusCode})` + colors.reset
          : colors.yellow + `⚠️  ${endpoint.name}: ${response.statusCode} (may require auth)` + colors.reset
      );
    } catch (error) {
      results.backend.endpoints.push({
        name: endpoint.name,
        path: endpoint.path,
        status: 'failed',
        error: error.message,
      });
      console.log(colors.red + `❌ ${endpoint.name}: FAILED (${error.message})` + colors.reset);
    }
  }
}

/**
 * Test CORS configuration
 */
async function testCORS() {
  console.log('\n' + colors.cyan + 'Testing CORS Configuration...' + colors.reset);
  
  try {
    const response = await makeRequest({
      hostname: BACKEND_HOST,
      port: BACKEND_PORT,
      path: '/api/health',
      method: 'OPTIONS',
      headers: {
        'Origin': `http://${FRONTEND_HOST}:${FRONTEND_PORT}`,
        'Access-Control-Request-Method': 'GET',
      },
    });

    const corsHeaders = {
      'access-control-allow-origin': response.headers['access-control-allow-origin'],
      'access-control-allow-methods': response.headers['access-control-allow-methods'],
      'access-control-allow-headers': response.headers['access-control-allow-headers'],
      'access-control-allow-credentials': response.headers['access-control-allow-credentials'],
    };

    results.cors.configured = !!corsHeaders['access-control-allow-origin'];
    results.cors.details = corsHeaders;

    if (results.cors.configured) {
      console.log(colors.green + '✅ CORS is configured' + colors.reset);
      console.log('   Allowed Origins:', corsHeaders['access-control-allow-origin'] || 'Not set');
      console.log('   Allowed Methods:', corsHeaders['access-control-allow-methods'] || 'Not set');
      console.log('   Allow Credentials:', corsHeaders['access-control-allow-credentials'] || 'Not set');
    } else {
      console.log(colors.yellow + '⚠️  CORS headers not found in OPTIONS response' + colors.reset);
    }
  } catch (error) {
    results.cors.configured = false;
    console.log(colors.red + `❌ CORS test failed: ${error.message}` + colors.reset);
  }
}

/**
 * Test frontend proxy (if frontend is running)
 */
async function testFrontendProxy() {
  console.log('\n' + colors.cyan + 'Testing Frontend Proxy...' + colors.reset);
  
  try {
    const response = await makeRequest({
      hostname: FRONTEND_HOST,
      port: FRONTEND_PORT,
      path: '/api/health',
      method: 'GET',
    });

    results.frontend.running = true;
    results.frontend.proxy = response.statusCode < 400;
    
    console.log(
      results.frontend.proxy
        ? colors.green + '✅ Frontend proxy is working' + colors.reset
        : colors.yellow + `⚠️  Frontend proxy returned status: ${response.statusCode}` + colors.reset
    );
  } catch (error) {
    results.frontend.running = false;
    results.frontend.proxy = false;
    console.log(colors.yellow + `⚠️  Frontend not running or proxy not accessible: ${error.message}` + colors.reset);
    console.log('   This is normal if the frontend dev server is not running.');
  }
}

/**
 * Check backend server is running
 */
async function checkBackendRunning() {
  console.log('\n' + colors.cyan + 'Checking Backend Server...' + colors.reset);
  
  try {
    const response = await makeRequest({
      hostname: BACKEND_HOST,
      port: BACKEND_PORT,
      path: '/api/health',
      method: 'GET',
    });

    results.backend.running = true;
    console.log(colors.green + `✅ Backend server is running on port ${BACKEND_PORT}` + colors.reset);
    return true;
  } catch (error) {
    results.backend.running = false;
    console.log(colors.red + `❌ Backend server is not running on port ${BACKEND_PORT}` + colors.reset);
    console.log('   Error:', error.message);
    return false;
  }
}

/**
 * Generate connectivity report
 */
function generateReport() {
  console.log('\n' + '='.repeat(60));
  console.log(colors.blue + 'CONNECTIVITY TEST REPORT' + colors.reset);
  console.log('='.repeat(60));

  // Backend Status
  console.log('\n' + colors.cyan + 'Backend Status:' + colors.reset);
  console.log('  Running:', results.backend.running ? colors.green + '✅ Yes' + colors.reset : colors.red + '❌ No' + colors.reset);
  console.log('  Health Check:', results.backend.health ? colors.green + '✅ Passed' + colors.reset : colors.red + '❌ Failed' + colors.reset);
  
  if (results.backend.endpoints.length > 0) {
    console.log('\n  Endpoint Tests:');
    results.backend.endpoints.forEach((endpoint) => {
      const icon = endpoint.status === 'success' ? '✅' : '❌';
      const color = endpoint.status === 'success' ? colors.green : colors.red;
      console.log(`    ${color}${icon} ${endpoint.name}${colors.reset} - ${endpoint.path} (${endpoint.statusCode || 'N/A'})`);
    });
  }

  // Frontend Status
  console.log('\n' + colors.cyan + 'Frontend Status:' + colors.reset);
  console.log('  Running:', results.frontend.running ? colors.green + '✅ Yes' + colors.reset : colors.yellow + '⚠️  No (dev server not running)' + colors.reset);
  console.log('  Proxy Working:', results.frontend.proxy ? colors.green + '✅ Yes' + colors.reset : colors.yellow + '⚠️  No' + colors.reset);

  // CORS Status
  console.log('\n' + colors.cyan + 'CORS Configuration:' + colors.reset);
  console.log('  Configured:', results.cors.configured ? colors.green + '✅ Yes' + colors.reset : colors.yellow + '⚠️  Not detected' + colors.reset);
  if (results.cors.details) {
    console.log('  Allowed Origins:', results.cors.details['access-control-allow-origin'] || 'Not set');
    console.log('  Allowed Methods:', results.cors.details['access-control-allow-methods'] || 'Not set');
  }

  // Overall Status
  console.log('\n' + colors.cyan + 'Overall Connectivity:' + colors.reset);
  if (results.backend.running && results.backend.health) {
    console.log(colors.green + '✅ Frontend and Backend are connected!' + colors.reset);
  } else if (results.backend.running && !results.backend.health) {
    console.log(colors.yellow + '⚠️  Backend is running but health check failed' + colors.reset);
  } else {
    console.log(colors.red + '❌ Backend is not running. Please start the backend server.' + colors.reset);
  }

  // Recommendations
  console.log('\n' + colors.cyan + 'Recommendations:' + colors.reset);
  if (!results.backend.running) {
    console.log('  1. Start the backend server: cd backend && ./gradlew bootRun');
  }
  if (!results.cors.configured && results.backend.running) {
    console.log('  2. Check CORS configuration in backend WebConfig.java');
  }
  if (!results.frontend.running) {
    console.log('  3. Start the frontend dev server: cd frontend && npm run dev');
  }
  if (results.backend.running && results.backend.health && results.cors.configured) {
    console.log('  ✅ All systems operational!');
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

/**
 * Main test function
 */
async function runTests() {
  console.log(colors.blue + '\n🔍 Frontend-Backend Connectivity Test' + colors.reset);
  console.log('='.repeat(60));

  // Check if backend is running
  const backendRunning = await checkBackendRunning();

  if (backendRunning) {
    // Test backend health
    await testBackendHealth();

    // Test backend endpoints
    await testBackendEndpoints();

    // Test CORS
    await testCORS();
  }

  // Test frontend proxy (optional)
  await testFrontendProxy();

  // Generate report
  generateReport();
}

// Run tests
runTests().catch((error) => {
  console.error(colors.red + 'Test execution failed:', error + colors.reset);
  process.exit(1);
});


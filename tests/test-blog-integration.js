#!/usr/bin/env node

/**
 * Comprehensive Blog Integration Test Suite
 * Tests all blog functionality and integration with the portfolio
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class BlogTestSuite {
  constructor() {
    this.testResults = [];
    this.errors = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    console.log(logMessage);
    
    if (type === 'error') {
      this.errors.push(logMessage);
    }
  }

  async runTest(testName, testFunction) {
    this.log(`Running test: ${testName}`);
    try {
      await testFunction();
      this.testResults.push({ name: testName, status: 'PASS' });
      this.log(`✅ ${testName} - PASSED`, 'success');
    } catch (error) {
      this.testResults.push({ name: testName, status: 'FAIL', error: error.message });
      this.log(`❌ ${testName} - FAILED: ${error.message}`, 'error');
    }
  }

  // Test 1: Verify project structure
  async testProjectStructure() {
    const requiredFiles = [
      'src/app/admin/blog/page.tsx',
      'src/app/admin/blog/actions.ts',
      'src/app/[lang]/blog/page.tsx',
      'src/app/[lang]/blog/[slug]/page.tsx',
      'src/lib/supabase/server.ts',
      'src/lib/supabase/client.ts',
      'src/lib/supabase/types.ts',
      'src/lib/markdown.ts',
      'src/lib/blog-utils.ts',
      'supabase-schema.sql',
      'blog-versioning-schema.sql'
    ];

    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        throw new Error(`Required file missing: ${file}`);
      }
    }
  }

  // Test 2: Verify TypeScript compilation
  async testTypeScriptCompilation() {
    try {
      execSync('npm run build', { stdio: 'pipe' });
    } catch (error) {
      throw new Error(`TypeScript compilation failed: ${error.message}`);
    }
  }

  // Test 3: Check dependencies
  async testDependencies() {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = [
      '@supabase/supabase-js',
      '@supabase/ssr',
      'unified',
      'remark-parse',
      'remark-rehype',
      'rehype-stringify',
      'dompurify',
      'jsdom'
    ];

    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    for (const dep of requiredDeps) {
      if (!allDeps[dep]) {
        throw new Error(`Missing dependency: ${dep}`);
      }
    }
  }

  // Test 4: Verify component imports
  async testComponentImports() {
    const components = [
      'src/components/admin/admin-posts-client.tsx',
      'src/components/admin/bulk-operations.tsx',
      'src/components/admin/post-version-history.tsx',
      'src/components/admin/auto-save-draft.tsx',
      'src/components/admin/post-import-export.tsx'
    ];

    for (const component of components) {
      if (!fs.existsSync(component)) {
        throw new Error(`Component missing: ${component}`);
      }

      const content = fs.readFileSync(component, 'utf8');
      
      // Check for proper imports
      if (!content.includes("'use client'")) {
        throw new Error(`Component ${component} missing 'use client' directive`);
      }

      // Check for proper exports
      if (!content.includes('export function') && !content.includes('export default')) {
        throw new Error(`Component ${component} missing proper exports`);
      }
    }
  }

  // Test 5: Verify environment variables
  async testEnvironmentVariables() {
    const envFile = '.env';
    if (!fs.existsSync(envFile)) {
      throw new Error('.env file not found');
    }

    const envContent = fs.readFileSync(envFile, 'utf8');
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'BLOG_ADMIN_EMAIL'
    ];

    for (const envVar of requiredEnvVars) {
      if (!envContent.includes(envVar)) {
        throw new Error(`Missing environment variable: ${envVar}`);
      }
    }
  }

  // Test 6: Check middleware configuration
  async testMiddleware() {
    const middlewareFile = 'src/middleware.ts';
    if (!fs.existsSync(middlewareFile)) {
      throw new Error('Middleware file not found');
    }

    const content = fs.readFileSync(middlewareFile, 'utf8');
    
    // Check for Supabase middleware
    if (!content.includes('createServerClient')) {
      throw new Error('Middleware missing Supabase integration');
    }

    // Check for admin route protection
    if (!content.includes('/admin')) {
      throw new Error('Middleware missing admin route protection');
    }
  }

  // Test 7: Verify internationalization setup
  async testInternationalization() {
    const messageFiles = ['src/locales/en.json', 'src/locales/fr.json', 'src/locales/de.json'];
    
    for (const file of messageFiles) {
      if (!fs.existsSync(file)) {
        throw new Error(`Message file missing: ${file}`);
      }

      const content = JSON.parse(fs.readFileSync(file, 'utf8'));
      
      // Check for blog navigation
      if (!content.Header?.nav?.blog) {
        throw new Error(`Blog navigation missing in ${file}`);
      }
    }
  }

  // Test 8: Check API routes
  async testApiRoutes() {
    const apiRoutes = [
      'src/app/admin/blog/import/route.ts',
      'src/app/[lang]/rss.xml/route.ts',
      'src/app/sitemap.xml/route.ts'
    ];

    for (const route of apiRoutes) {
      if (!fs.existsSync(route)) {
        throw new Error(`API route missing: ${route}`);
      }

      const content = fs.readFileSync(route, 'utf8');
      if (!content.includes('export async function')) {
        throw new Error(`API route ${route} missing proper export`);
      }
    }
  }

  // Test 9: Verify database types
  async testDatabaseTypes() {
    const typesFile = 'src/lib/supabase/types.ts';
    const content = fs.readFileSync(typesFile, 'utf8');

    const requiredTypes = [
      'PostWithAuthor',
      'PostStatus',
      'Database'
    ];

    for (const type of requiredTypes) {
      if (!content.includes(type)) {
        throw new Error(`Missing type definition: ${type}`);
      }
    }
  }

  // Test 10: Check server actions
  async testServerActions() {
    const actionsFile = 'src/app/admin/blog/actions.ts';
    const content = fs.readFileSync(actionsFile, 'utf8');

    const requiredActions = [
      'createPost',
      'updatePost',
      'deletePost',
      'rollbackToVersion',
      'duplicatePost',
      'bulkDeletePosts'
    ];

    for (const action of requiredActions) {
      if (!content.includes(`export async function ${action}`)) {
        throw new Error(`Missing server action: ${action}`);
      }
    }
  }

  // Generate comprehensive test report
  generateReport() {
    const passedTests = this.testResults.filter(t => t.status === 'PASS').length;
    const failedTests = this.testResults.filter(t => t.status === 'FAIL').length;
    const totalTests = this.testResults.length;

    const report = `
=====================================
BLOG INTEGRATION TEST REPORT
=====================================

📊 SUMMARY:
- Total Tests: ${totalTests}
- Passed: ${passedTests} ✅
- Failed: ${failedTests} ❌
- Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%

📋 DETAILED RESULTS:
${this.testResults.map(test => 
  `${test.status === 'PASS' ? '✅' : '❌'} ${test.name}${test.error ? ` - ${test.error}` : ''}`
).join('\n')}

${this.errors.length > 0 ? `
🚨 ERRORS:
${this.errors.join('\n')}
` : '🎉 ALL TESTS PASSED!'}

=====================================
INTEGRATION STATUS: ${failedTests === 0 ? 'READY FOR PRODUCTION' : 'NEEDS ATTENTION'}
=====================================
`;

    console.log(report);
    
    // Save report to file
    fs.writeFileSync('test-report.txt', report);
    this.log('Test report saved to test-report.txt');
    
    return failedTests === 0;
  }

  // Run all tests
  async runAllTests() {
    this.log('🚀 Starting comprehensive blog integration tests...');

    await this.runTest('Project Structure', () => this.testProjectStructure());
    await this.runTest('TypeScript Compilation', () => this.testTypeScriptCompilation());
    await this.runTest('Dependencies', () => this.testDependencies());
    await this.runTest('Component Imports', () => this.testComponentImports());
    await this.runTest('Environment Variables', () => this.testEnvironmentVariables());
    await this.runTest('Middleware Configuration', () => this.testMiddleware());
    await this.runTest('Internationalization', () => this.testInternationalization());
    await this.runTest('API Routes', () => this.testApiRoutes());
    await this.runTest('Database Types', () => this.testDatabaseTypes());
    await this.runTest('Server Actions', () => this.testServerActions());

    return this.generateReport();
  }
}

// Run the test suite
if (require.main === module) {
  const testSuite = new BlogTestSuite();
  testSuite.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = BlogTestSuite;
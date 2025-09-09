#!/usr/bin/env node

/**
 * Test script for Alex Hormozi AI Coaching API
 * Tests the integration with n8n workflow
 */

const API_BASE = 'http://localhost:3000';

const testCases = [
  {
    name: 'Coaching Methodology - Default Test',
    payload: {
      query: 'My business is stuck at $50k/month. I have good leads but struggling to convert them. What should I focus on using Alex Hormozi methodology?',
      sessionType: 'diagnostic',
      userId: 'test-user-123',
      businessContext: {
        businessStage: 'growth',
        industry: 'SaaS',
        currentRevenue: 50000,
        customerCount: 150,
        grossMargin: 0.8
      }
    }
  },
  {
    name: 'Coaching Methodology - Explicit Agent',
    payload: {
      query: 'How do I apply the 4 Universal Business Constraints to diagnose my business problems?',
      sessionType: 'strategic',
      userId: 'test-user-123',
      agent: 'coaching-methodology',
      businessContext: {
        businessStage: 'scale',
        industry: 'E-commerce',
        currentRevenue: 100000,
        customerCount: 200
      }
    }
  },
  {
    name: 'Coaching Methodology - Implementation Focus',
    payload: {
      query: 'I need step-by-step guidance on implementing Alex Hormozi principles in my online course business',
      sessionType: 'implementation',
      userId: 'test-user-123',
      agent: 'coaching-methodology',
      businessContext: {
        businessStage: 'startup',
        industry: 'Education',
        currentRevenue: 10000
      }
    }
  }
];

async function testCoachingAPI(testCase) {
  console.log(`\n🧪 Testing: ${testCase.name}`);
  console.log('━'.repeat(50));
  
  try {
    const response = await fetch(`${API_BASE}/api/coach`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCase.payload),
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error(`❌ HTTP ${response.status}: ${response.statusText}`);
      console.error(`Response: ${responseText}`);
      return false;
    }

    const result = JSON.parse(responseText);
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`🎯 Agent: ${result.agent}`);
    console.log(`📝 Query: ${testCase.payload.query.substring(0, 80)}...`);
    
    if (result.synthesis) {
      console.log(`💡 Synthesis: ${result.synthesis.substring(0, 150)}...`);
    }
    
    if (result.actionItems && result.actionItems.length > 0) {
      console.log(`📋 Action Items: ${result.actionItems.length} items`);
      result.actionItems.slice(0, 2).forEach((item, i) => {
        console.log(`   ${i + 1}. ${item.title} [${item.priority}]`);
      });
    }
    
    if (result.frameworks && result.frameworks.length > 0) {
      console.log(`🧠 Frameworks: ${result.frameworks.join(', ')}`);
    }
    
    console.log(`⏱️  Response Time: ${new Date(result.timestamp).toISOString()}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Alex Hormozi AI Coaching API Test Suite');
  console.log('═'.repeat(60));
  
  // Test API health first
  try {
    console.log('\n🔍 Checking API health...');
    const healthResponse = await fetch(`${API_BASE}/api/coach`);
    const health = await healthResponse.json();
    console.log(`✅ API Status: ${health.status}`);
    console.log(`📡 Active Agents: ${health.activeAgents?.join(', ')}`);
    console.log(`🎯 Default Agent: ${health.defaultAgent}`);
  } catch (error) {
    console.error('❌ API Health Check Failed:', error.message);
    console.error('Make sure your Next.js dev server is running on localhost:3000');
    process.exit(1);
  }
  
  let passed = 0;
  let total = testCases.length;
  
  for (const testCase of testCases) {
    const success = await testCoachingAPI(testCase);
    if (success) passed++;
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📊 Test Results');
  console.log('═'.repeat(30));
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! Your n8n integration is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the error messages above.');
  }
}

// Run the tests
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { testCoachingAPI, runAllTests };
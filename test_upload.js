#!/usr/bin/env node

/**
 * Test script to verify file upload functionality
 * This script tests the upload API endpoint to ensure it can handle files without 413 errors
 */

const fs = require('fs');
const path = require('path');

// Create a test audio file (simulated)
function createTestAudioFile() {
  const testDir = path.join(__dirname, 'test-files');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir);
  }
  
  const testFilePath = path.join(testDir, 'test-audio.mp3');
  
  // Create a fake audio file (in real scenario this would be actual audio data)
  const fakeAudioData = Buffer.alloc(1024 * 1024); // 1MB file
  fs.writeFileSync(testFilePath, fakeAudioData);
  
  return testFilePath;
}

async function testUpload() {
  const testFile = createTestAudioFile();
  const fileStats = fs.statSync(testFile);
  
  console.log(`📁 Test file created: ${testFile}`);
  console.log(`📊 File size: ${(fileStats.size / 1024 / 1024).toFixed(2)}MB`);
  
  // Test the API endpoint
  const FormData = require('form-data');
  const form = new FormData();
  
  form.append('file', fs.createReadStream(testFile));
  form.append('title', 'Test Song');
  form.append('artist', 'Test Artist');
  
  console.log('🚀 Testing upload to /api/songs...');
  
  try {
    const response = await fetch('http://localhost:3000/api/songs', {
      method: 'POST',
      body: form,
      headers: {
        ...form.getHeaders(),
        // Add auth header if needed
        'Authorization': 'Bearer test-token'
      }
    });
    
    console.log(`📡 Response status: ${response.status}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Upload successful:', result);
    } else {
      const error = await response.text();
      console.log('❌ Upload failed:', error);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
  
  // Clean up test file
  fs.unlinkSync(testFile);
  fs.rmdirSync(path.dirname(testFile));
  console.log('🧹 Test file cleaned up');
}

// Run the test
testUpload().catch(console.error); 
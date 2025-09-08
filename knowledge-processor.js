// Alex Hormozi Knowledge Base Processor
// This script processes the transcripts into structured knowledge chunks

const fs = require('fs');
const path = require('path');

// Knowledge extraction patterns
const FRAMEWORKS = {
  'CLIENT_FINANCED_ACQUISITION': {
    keywords: ['CFA', 'client financed', 'customer financed', '30 day gross profit', 'CAC'],
    definition: 'Process where gross profit in first 30 days exceeds customer acquisition cost'
  },
  'FOUR_PRONG_MODEL': {
    keywords: ['attraction', 'upsell', 'downsell', 'continuity', '4 prong', 'four prong'],
    definition: 'Four types of offers: Attraction (liquidate CAC), Upsell (maximize profit), Downsell (maximize conversion), Continuity (stabilize cash)'
  },
  'THREE_LEVELS_ADVERTISING': {
    keywords: ['level 1', 'level 2', 'level 3', 'LTV greater than CAC', '30 day', '2x CAC'],
    definition: 'Level 1: LTV > CAC, Level 2: 30-day GP > CAC, Level 3: 30-day GP > 2x CAC'
  },
  'FIVE_UPSELL_MOMENTS': {
    keywords: ['immediately', 'next step', 'big win', 'halfway', 'last chance', 'upsell timing'],
    definition: 'Optimal timing for upsells: 1) Immediately, 2) Next step (24-72hrs), 3) After big win, 4) Halfway point, 5) Last chance'
  }
};

const CASE_STUDIES = {
  'GYM_INDUSTRY': {
    keywords: ['gym launch', 'gym industry', '191 signups', '$17 million', 'broke the industry'],
    context: 'How Alex broke the gym industry by replacing low-barrier offers with 4-prong money model'
  },
  'RENTAL_CAR': {
    keywords: ['rental car', 'tundra', '$19 to $400', 'money model'],
    context: 'Perfect example of sequential upsells turning $19 reservation into $400 transaction'
  },
  'SUPPLEMENT_COMPANY': {
    keywords: ['supplements', '$200 per person', '$100 profit', 'nutrition orientation'],
    context: 'How Alex added supplements to gyms to offset CAC and achieve profitability'
  }
};

function extractFrameworks(text) {
  const extracted = [];
  
  for (const [framework, data] of Object.entries(FRAMEWORKS)) {
    for (const keyword of data.keywords) {
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        // Find context around the keyword (500 chars before/after)
        const index = text.toLowerCase().indexOf(keyword.toLowerCase());
        const start = Math.max(0, index - 500);
        const end = Math.min(text.length, index + 500);
        const context = text.slice(start, end);
        
        extracted.push({
          framework,
          definition: data.definition,
          context,
          keyword,
          type: 'framework'
        });
        break; // Only extract once per framework per chunk
      }
    }
  }
  
  return extracted;
}

function extractCaseStudies(text) {
  const extracted = [];
  
  for (const [study, data] of Object.entries(CASE_STUDIES)) {
    for (const keyword of data.keywords) {
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        // Find larger context for case studies (1000 chars)
        const index = text.toLowerCase().indexOf(keyword.toLowerCase());
        const start = Math.max(0, index - 1000);
        const end = Math.min(text.length, index + 1000);
        const context = text.slice(start, end);
        
        extracted.push({
          case_study: study,
          description: data.context,
          content: context,
          keyword,
          type: 'case_study'
        });
        break;
      }
    }
  }
  
  return extracted;
}

function chunkText(text, chunkSize = 800, overlap = 100) {
  const chunks = [];
  let start = 0;
  
  // Split by paragraphs first to avoid breaking in middle of sentences
  const paragraphs = text.split('\n\n');
  let currentChunk = '';
  
  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length <= chunkSize) {
      currentChunk += paragraph + '\n\n';
    } else {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = paragraph + '\n\n';
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

function processTranscript(filePath, fileName) {
  console.log(`Processing ${fileName}...`);
  
  try {
    // Read file size first
    const stats = fs.statSync(filePath);
    console.log(`  File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    
    // Skip files larger than 10MB
    if (stats.size > 10 * 1024 * 1024) {
      console.log(`  ⚠️ Skipping ${fileName} - too large (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
      return [];
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const chunks = chunkText(content);
    
    const processed = [];
    
    // Process in batches to avoid memory issues
    const batchSize = 50;
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      
      for (let j = 0; j < batch.length; j++) {
        const chunk = batch[j];
        const index = i + j;
        
        const frameworks = extractFrameworks(chunk);
        const caseStudies = extractCaseStudies(chunk);
        
        processed.push({
          id: `${fileName.replace('.md', '')}_chunk_${index}`,
          source_file: fileName,
          chunk_index: index,
          content: chunk.trim(),
          frameworks,
          case_studies: caseStudies,
          type: 'transcript',
          word_count: chunk.split(' ').length,
          metadata: {
            has_frameworks: frameworks.length > 0,
            has_case_studies: caseStudies.length > 0,
            framework_count: frameworks.length,
            case_study_count: caseStudies.length
          }
        });
      }
      
      // Force garbage collection between batches
      if (global.gc) {
        global.gc();
      }
    }
    
    console.log(`✅ ${fileName}: ${processed.length} chunks, ${processed.filter(p => p.frameworks.length > 0).length} with frameworks`);
    return processed;
    
  } catch (error) {
    console.error(`❌ Error processing ${fileName}:`, error.message);
    return [];
  }
}

// Main processing function
function processAllTranscripts() {
  const transcriptDir = '/Users/kesonpurpose/Downloads/UIB ASSETS/Cursor App Build/Alex Hormozi 100 Million Dollar Money Models frameworks/context';
  const outputDir = '/Users/kesonpurpose/Downloads/UIB ASSETS/Cursor App Build/alex-hormozi-ai/alex-hormozi-ai/knowledge-base';
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Find all transcript files
  const files = [];
  
  // Book transcript
  const bookPath = path.join(transcriptDir, '100M Dollar Money Models Book', '100 million Dollar Money models Book Transcript.md');
  if (fs.existsSync(bookPath)) {
    files.push({
      path: bookPath,
      name: 'Book_Transcript.md'
    });
  }
  
  // Module transcripts
  const moduleDir = path.join(transcriptDir, '100M Dollar Money Models Module transcripts');
  if (fs.existsSync(moduleDir)) {
    const moduleFiles = fs.readdirSync(moduleDir)
      .filter(file => file.endsWith('.md'))
      .map(file => ({
        path: path.join(moduleDir, file),
        name: file
      }));
    files.push(...moduleFiles);
  }
  
  console.log(`🚀 Processing ${files.length} transcript files...`);
  
  let allChunks = [];
  
  for (const file of files) {
    const processed = processTranscript(file.path, file.name);
    allChunks.push(...processed);
  }
  
  // Save processed knowledge base
  const knowledgeBase = {
    meta: {
      processed_at: new Date().toISOString(),
      total_chunks: allChunks.length,
      total_frameworks: allChunks.reduce((sum, chunk) => sum + chunk.frameworks.length, 0),
      total_case_studies: allChunks.reduce((sum, chunk) => sum + chunk.case_studies.length, 0),
      source_files: files.length
    },
    chunks: allChunks
  };
  
  // Save as JSON
  fs.writeFileSync(
    path.join(outputDir, 'processed-knowledge-base.json'),
    JSON.stringify(knowledgeBase, null, 2)
  );
  
  // Save frameworks separately
  const frameworks = allChunks
    .filter(chunk => chunk.frameworks.length > 0)
    .map(chunk => ({
      source: chunk.source_file,
      chunk_id: chunk.id,
      frameworks: chunk.frameworks,
      content: chunk.content
    }));
    
  fs.writeFileSync(
    path.join(outputDir, 'frameworks-extracted.json'),
    JSON.stringify(frameworks, null, 2)
  );
  
  // Save case studies separately
  const caseStudies = allChunks
    .filter(chunk => chunk.case_studies.length > 0)
    .map(chunk => ({
      source: chunk.source_file,
      chunk_id: chunk.id,
      case_studies: chunk.case_studies,
      content: chunk.content
    }));
    
  fs.writeFileSync(
    path.join(outputDir, 'case-studies-extracted.json'),
    JSON.stringify(caseStudies, null, 2)
  );
  
  console.log(`\n📊 PROCESSING COMPLETE:`);
  console.log(`   • Total Chunks: ${allChunks.length}`);
  console.log(`   • Framework Instances: ${knowledgeBase.meta.total_frameworks}`);
  console.log(`   • Case Study Instances: ${knowledgeBase.meta.total_case_studies}`);
  console.log(`   • Source Files: ${files.length}`);
  console.log(`   • Output Directory: ${outputDir}`);
  
  return knowledgeBase;
}

// Run the processor
if (require.main === module) {
  processAllTranscripts();
}

module.exports = { processAllTranscripts, extractFrameworks, extractCaseStudies };
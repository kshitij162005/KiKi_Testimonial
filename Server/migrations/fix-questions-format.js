const mongoose = require('mongoose');
const { Space } = require('../models/Space');

// Migration script to fix questions format from comma-separated string to array
async function fixQuestionsFormat() {
  try {
    console.log('Starting questions format migration...');
    
    // Find all spaces
    const spaces = await Space.find({});
    console.log(`Found ${spaces.length} spaces to check`);
    
    let updatedCount = 0;
    
    for (const space of spaces) {
      // Check if questions is a string (old format)
      if (typeof space.questions === 'string' && space.questions.length > 0) {
        console.log(`Fixing questions for space: ${space.spacename}`);
        
        // Convert comma-separated string to array
        const questionsArray = space.questions
          .split(',')
          .map(q => q.trim())
          .filter(q => q.length > 0);
        
        // Update the space
        await Space.findByIdAndUpdate(space._id, {
          questions: questionsArray
        });
        
        updatedCount++;
        console.log(`Updated questions for ${space.spacename}: ${questionsArray.length} questions`);
      } else if (Array.isArray(space.questions)) {
        console.log(`Space ${space.spacename} already has questions in correct format`);
      } else {
        console.log(`Space ${space.spacename} has no questions`);
      }
    }
    
    console.log(`Migration completed. Updated ${updatedCount} spaces.`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/nova_testimonial')
    .then(() => {
      console.log('Connected to MongoDB');
      return fixQuestionsFormat();
    })
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { fixQuestionsFormat };
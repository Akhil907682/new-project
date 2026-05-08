const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb+srv://akhils88815_db_user:OKr0qFbfEM5Bidx1@akhil.nl69xgn.mongodb.net/CampusGuardDB?retryWrites=true&w=majority&appName=Akhil';

mongoose.connect(uri)
  .then(async () => {
    console.log('Connected to DB. Starting migration...');
    const db = mongoose.connection.db;
    
    // Fetch all old users
    const oldUsers = await db.collection('users').find({}).toArray();
    console.log(`Found ${oldUsers.length} old users.`);
    
    let migratedCount = 0;
    
    for (const user of oldUsers) {
      if (user.role === 'admin') {
        // Check if exists in admins
        const exists = await db.collection('admins').findOne({ email: user.email });
        if (!exists) {
          await db.collection('admins').insertOne(user);
          migratedCount++;
        }
      } else {
        // Check if exists in students
        const exists = await db.collection('students').findOne({ email: user.email });
        if (!exists) {
          // ensure course field exists since it is required for students now
          user.course = user.course || 'Legacy User';
          await db.collection('students').insertOne(user);
          migratedCount++;
        }
      }
    }
    
    console.log(`Successfully migrated ${migratedCount} users.`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb+srv://akhils88815_db_user:OKr0qFbfEM5Bidx1@akhil.nl69xgn.mongodb.net/CampusGuardDB?retryWrites=true&w=majority&appName=Akhil';

mongoose.connect(uri)
  .then(async () => {
    console.log('Connected to DB');
    const db = mongoose.connection.db;
    
    // Check collections
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Check complaints count
    const complaintsCount = await db.collection('complaints').countDocuments();
    console.log('Total Complaints:', complaintsCount);
    
    // Check old users
    const oldUsersCount = await db.collection('users').countDocuments();
    console.log('Old Users:', oldUsersCount);
    
    // Check new students/admins
    const studentsCount = await db.collection('students').countDocuments();
    console.log('Students:', studentsCount);
    
    const adminsCount = await db.collection('admins').countDocuments();
    console.log('Admins:', adminsCount);
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

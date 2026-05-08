const mongoose = require('mongoose');

const SOURCE_URI = 'mongodb+srv://akhils88815_db_user:OKr0qFbfEM5Bidx1@akhil.nl69xgn.mongodb.net/Quirex?retryWrites=true&w=majority&appName=Akhil';
const TARGET_URI = 'mongodb+srv://akhils88815_db_user:OKr0qFbfEM5Bidx1@akhil.nl69xgn.mongodb.net/CampusGuardDB?retryWrites=true&w=majority&appName=Akhil';

async function migrate() {
    console.log('--- Starting Database Separation & Migration ---');
    
    // Connect to connections
    const sourceConn = await mongoose.createConnection(SOURCE_URI).asPromise();
    console.log('Connected to Source database (Quirex)');
    
    const targetConn = await mongoose.createConnection(TARGET_URI).asPromise();
    console.log('Connected to Target database (CampusGuardDB)');

    try {
        // --- 1. Migrate Users ---
        console.log('\nStep 1: Migrating relevant users (admins & students)...');
        const sourceUsersCol = sourceConn.collection('users');
        const targetUsersCol = targetConn.collection('users');

        const usersToMigrate = await sourceUsersCol.find({ 
            role: { $in: ['admin', 'student'] } 
        }).toArray();

        console.log(`Found ${usersToMigrate.length} users to migrate.`);
        
        if (usersToMigrate.length > 0) {
            // Check for existing users in target to avoid duplicates
            for (const user of usersToMigrate) {
                const exists = await targetUsersCol.findOne({ _id: user._id });
                if (!exists) {
                    await targetUsersCol.insertOne(user);
                }
            }
            console.log('Users migration completed.');
        }

        // --- 2. Migrate Complaints ---
        console.log('\nStep 2: Migrating all complaints...');
        const sourceComplaintsCol = sourceConn.collection('complaints');
        const targetComplaintsCol = targetConn.collection('complaints');

        const complaintsToMigrate = await sourceComplaintsCol.find({}).toArray();
        console.log(`Found ${complaintsToMigrate.length} complaints to migrate.`);

        if (complaintsToMigrate.length > 0) {
             for (const complaint of complaintsToMigrate) {
                const exists = await targetComplaintsCol.findOne({ _id: complaint._id });
                if (!exists) {
                    await targetComplaintsCol.insertOne(complaint);
                }
            }
            console.log('Complaints migration completed.');
        }

        // --- 3. Verification ---
        console.log('\nStep 3: Verification...');
        const finalTargetUserCount = await targetUsersCol.countDocuments({ role: { $in: ['admin', 'student'] } });
        const finalTargetComplaintCount = await targetComplaintsCol.countDocuments({});
        
        console.log(`Verification: ${finalTargetUserCount} users and ${finalTargetComplaintCount} complaints now in CampusGuardDB.`);

        // --- 4. Cleanup (Conditional) ---
        console.log('\nStep 4: Cleaning up legacy data in Quirex...');
        
        const userDeleteResult = await sourceUsersCol.deleteMany({ 
            role: { $in: ['admin', 'student'] } 
        });
        console.log(`Deleted ${userDeleteResult.deletedCount} users from Quirex.`);

        const complaintDeleteResult = await sourceComplaintsCol.deleteMany({});
        console.log(`Deleted ${complaintDeleteResult.deletedCount} complaints (collection cleared) from Quirex.`);

        console.log('\n--- Migration & Separation Successful! ---');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await sourceConn.close();
        await targetConn.close();
        process.exit(0);
    }
}

migrate();

import mongoose from 'mongoose';
import Admin from '../models/Admin';
import { connectDB } from '../config/database';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const createDefaultAdmin = async () => {
  try {
    // Connect to database
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('✅ Default admin already exists');
      console.log('Username: admin');
      console.log('Admin ID:', existingAdmin._id);
      return;
    }

    // Create default admin
    const defaultAdmin = new Admin({
      username: 'admin',
      password: 'admin123', // This will be hashed automatically
      isActive: true
    });

    await defaultAdmin.save();

    console.log('🎉 Default admin created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Admin ID:', defaultAdmin._id);
    console.log('⚠️  Please change the default password after first login for security!');

  } catch (error) {
    console.error('❌ Error creating default admin:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('📱 Database connection closed');
  }
};

// Run the script
createDefaultAdmin(); 
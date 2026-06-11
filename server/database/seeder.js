const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedSuperAdmin = async () => {
  try {
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      console.log('No users found in database. Seeding default superadmin...');
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('superadmin123', salt);

      await User.create({
        username: 'superadmin',
        password: hashedPassword,
        role: 'superadmin'
      });
      
      console.log('Default superadmin seeded successfully (username: superadmin, password: superadmin123)');
    } else {
      console.log('Users already exist in database. Skipping seeder.');
    }
  } catch (error) {
    console.error('Error seeding superadmin:', error.message);
  }
};

module.exports = seedSuperAdmin;

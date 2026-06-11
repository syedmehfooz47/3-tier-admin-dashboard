const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    // Exclude passwords
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching users', error: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    if (!['superadmin', 'admin', 'user'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified' });
    }

    // Prevent changing your own role to something else if you are a superadmin 
    // to avoid accidentally locking out the only superadmin, but for simplicity we just allow it.
    
    const user = await User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true }).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating user role', error: error.message });
  }
};

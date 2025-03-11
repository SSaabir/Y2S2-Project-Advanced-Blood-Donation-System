import SystemManager from "../models/SystemManager.model.js";

// ✅ Get all system managers
export const getSystemManagers = async (req, res) => {
    try {
        const managers = await SystemManager.find();
        res.json(managers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching system managers", error });
    }
};

// ✅ Get a single system manager by ID
export const getSystemManagerById = async (req, res) => {
    try {
        const manager = await SystemManager.findById(req.params.id);
        if (!manager) return res.status(404).json({ message: "System Manager not found" });
        res.json(manager);
    } catch (error) {
        res.status(500).json({ message: "Error fetching system manager", error });
    }
};

export const createSystemManager = async (req, res) => {
    try {
        const { 
            firstName, 
            lastName, 
            phoneNumber, 
            email, 
            password, 
            nic, 
            address, 
            dob, 
            role, 
            activeStatus 
        } = req.body;

        // Check for required fields
        const requiredFields = { firstName, lastName, phoneNumber, email, password, nic, address, dob, role };
        const missingFields = Object.keys(requiredFields).filter(key => !requiredFields[key]);
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                message: `Missing required fields: ${missingFields.join(', ')}` 
            });
        }

        // Check for existing email, phoneNumber, or nic
        const existingManager = await SystemManager.findOne({
            $or: [{ email }, { phoneNumber }, { nic }]
        });
        if (existingManager) {
            const field = existingManager.email === email ? 'Email' : 
                         existingManager.phoneNumber === phoneNumber ? 'Phone Number' : 'NIC';
            return res.status(400).json({ message: `${field} already in use` });
        }

        // Handle image if uploaded
        const image = req.file ? req.file.path : null;

        // Hash password (uncomment and adjust if using bcrypt)
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);

        const newManager = new SystemManager({
            firstName,
            lastName,
            phoneNumber,
            email,
            password, // Replace with hashedPassword if using bcrypt
            nic,
            address,
            image,
            dob: new Date(dob), // Ensure dob is a Date object
            role,
            activeStatus: activeStatus !== undefined ? activeStatus : true // Use schema default if omitted
        });

        await newManager.save();

        // Remove password from response
        const responseManager = newManager.toObject();
        delete responseManager.password;

        res.status(201).json(responseManager);
    } catch (error) {
        console.error('Create error:', error); // Log for debugging
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Validation failed", 
                errors: Object.values(error.errors).map(err => err.message) 
            });
        }
        res.status(500).json({ 
            message: "Error creating system manager", 
            error: error.message 
        });
    }
};

// ✅ Update system manager details
export const updateSystemManager = async (req, res) => {
    try {
        const updates = { ...req.body };
        if (req.file) {
            updates.image = req.file.path;
        }

        const updatedManager = await SystemManager.findByIdAndUpdate(req.params.id, updates, { new: true });

        if (!updatedManager) return res.status(404).json({ message: 'System Manager not found' });

        res.status(200).json(updatedManager);
    } catch (error) {
        res.status(500).json({ message: 'Error updating manager', error });
    }
};

// ✅ Delete a system manager
export const deleteSystemManager = async (req, res) => {
    try {
        const deletedManager = await SystemManager.findByIdAndDelete(req.params.id);
        if (!deletedManager) return res.status(404).json({ message: "System Manager not found" });

        res.json({ message: "System Manager deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting system manager", error });
    }
};

export const activateDeactivateSystemManager = async (req, res) => {
    try {
      console.log('Toggle route hit for ID:', req.params.id);
      const { id } = req.params;
  
      const manager = await SystemManager.findById(id);
      if (!manager) {
        console.log('Manager not found for ID:', id);
        return res.status(404).json({ message: "System Manager not found" });
      }
  
      const newStatus = !manager.activeStatus;
      const updatedManager = await SystemManager.findByIdAndUpdate(
        id,
        { $set: { activeStatus: newStatus } },
        { new: true } // Return the updated document
      );
  
      console.log('Manager updated:', updatedManager);
  
      res.status(200).json({
        message: `System Manager ${newStatus ? 'activated' : 'deactivated'} successfully`,
        manager: updatedManager,
      });
    } catch (error) {
      console.error('Activate/Deactivate error:', error);
      res.status(500).json({
        message: "Error toggling system manager status",
        error: error.message,
      });
    }
  };
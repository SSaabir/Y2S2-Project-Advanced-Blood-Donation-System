import BloodInventory from "../models/BloodInventory.model.js";

// Get all blood inventory records
export const getBloodInventory = async (req, res) => {
    try {
        const inventory = await BloodInventory.find();
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blood inventory" });
    }
};

// Get all blood inventory records by Hospital ID
export const getBloodInventoryByHospital = async (req, res) => {
    try {
        const inventory = await BloodInventory.find({ hospitalId: req.params.id });
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blood inventory" });
    }
};

// Get a single blood inventory record by ID
export const getBloodInventoryById = async (req, res) => {
    try {
        const record = await BloodInventory.findById(req.params.id).populate('hospitalId');
        if (!record) return res.status(404).json({ message: "Blood inventory record not found" });
        res.json(record);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blood inventory" });
    }
};

// Create a new blood inventory record
export const createBloodInventory = async (req, res) => {
    try {
        const { hospitalId, bloodType, availableStocks, expirationDate } = req.body;

        if (!hospitalId || !bloodType || !availableStocks || !expirationDate) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newInventory = new BloodInventory({
            hospitalId,
            bloodType,
            availableStocks,
            expirationDate,
        });

        await newInventory.save();
        res.status(201).json({ success: true, data: newInventory });
    } catch (error) {
        res.status(400).json({ message: "Error creating blood inventory record" });
    }
};

// Update blood inventory details
export const updateBloodInventory = async (req, res) => {
    try {
        const updatedInventory = await BloodInventory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedInventory) return res.status(404).json({ message: "Blood inventory record not found" });

        res.status(200).json(updatedInventory);
    } catch (error) {
        res.status(500).json({ message: "Error updating blood inventory record" });
    }
};

// Delete a blood inventory record
export const deleteBloodInventory = async (req, res) => {
    try {
        const deletedInventory = await BloodInventory.findByIdAndDelete(req.params.id);
        if (!deletedInventory) return res.status(404).json({ message: "Blood inventory record not found" });

        res.json({ message: "Blood inventory record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting blood inventory record" });
    }
};

// Toggle expired status
export const toggleExpired = async (req, res) => {
    try {
        const inventory = await BloodInventory.findByIdAndUpdate(
            req.params.id,
            { expiredStatus: true },
            { new: true }
        );

        if (!inventory) return res.status(404).json({ message: "Blood inventory record not found" });

        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: "Error toggling expired status" });
    }
};
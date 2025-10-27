const captainModel = require('../models/captain.model');
const rideModel = require('../models/ride.model');

// Start captain session (when captain goes online)
module.exports.startSession = async (captainId) => {
    try {
        const captain = await captainModel.findById(captainId);
        if (!captain) {
            throw new Error('Captain not found');
        }

        // Check if it's a new day - reset daily stats if needed
        const today = new Date().toDateString();
        const lastActiveDate = new Date(captain.statistics.lastActiveDate).toDateString();
        
        if (today !== lastActiveDate) {
            // New day - reset daily stats
            captain.statistics.dailyHours = 0;
            captain.statistics.dailyEarnings = 0;
            captain.statistics.lastActiveDate = new Date();
        }

        // Start new session
        captain.statistics.sessionStartTime = new Date();
        captain.status = 'active';
        
        console.log('Starting session for captain:', captain._id);
        console.log('Setting status to active:', captain.status);
        
        await captain.save();
        
        console.log('Captain saved with status:', captain.status);
        return captain;
    } catch (error) {
        throw new Error(`Failed to start session: ${error.message}`);
    }
};

// End captain session (when captain goes offline)
module.exports.endSession = async (captainId) => {
    try {
        const captain = await captainModel.findById(captainId);
        if (!captain) {
            throw new Error('Captain not found');
        }

        if (captain.statistics.sessionStartTime) {
            const sessionDuration = Date.now() - captain.statistics.sessionStartTime.getTime();
            const sessionHours = sessionDuration / (1000 * 60 * 60); // Convert to hours

            // Update daily and total hours
            captain.statistics.dailyHours += sessionHours;
            captain.statistics.totalHours += sessionHours;
            
            captain.statistics.sessionStartTime = null;
            captain.status = 'inactive';
            
            await captain.save();
        }

        return captain;
    } catch (error) {
        throw new Error(`Failed to end session: ${error.message}`);
    }
};

// Update earnings when ride is completed
module.exports.updateEarnings = async (captainId, amount) => {
    try {
        const captain = await captainModel.findById(captainId);
        if (!captain) {
            throw new Error('Captain not found');
        }

        // Update daily and total earnings
        captain.statistics.dailyEarnings += amount;
        captain.statistics.totalEarnings += amount;
        
        await captain.save();
        return captain;
    } catch (error) {
        throw new Error(`Failed to update earnings: ${error.message}`);
    }
};

// Get captain statistics
module.exports.getCaptainStats = async (captainId) => {
    try {
        console.log('Getting captain stats for:', captainId);
        const captain = await captainModel.findById(captainId).select('statistics fullname status');
        if (!captain) {
            throw new Error('Captain not found');
        }
        
        console.log('Found captain:', {
            _id: captain._id,
            status: captain.status,
            statistics: captain.statistics
        });

        // Calculate current session time if captain is online
        let currentSessionHours = 0;
        if (captain.statistics.sessionStartTime && captain.status === 'active') {
            const sessionDuration = Date.now() - captain.statistics.sessionStartTime.getTime();
            currentSessionHours = sessionDuration / (1000 * 60 * 60);
        }

        // Get completed rides count for today
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        const todayRides = await rideModel.countDocuments({
            captain: captainId,
            status: 'completed',
            createdAt: { $gte: startOfDay }
        });

        const totalRides = await rideModel.countDocuments({
            captain: captainId,
            status: 'completed'
        });

        const result = {
            captainId: captain._id,
            name: `${captain.fullname.firstname} ${captain.fullname.lastname}`,
            dailyHours: parseFloat((captain.statistics.dailyHours + currentSessionHours).toFixed(1)),
            totalHours: parseFloat((captain.statistics.totalHours + currentSessionHours).toFixed(1)),
            dailyEarnings: captain.statistics.dailyEarnings,
            totalEarnings: captain.statistics.totalEarnings,
            todayRides,
            totalRides,
            status: captain.status,
            isOnline: captain.status === 'active'
        };
        
        console.log('Captain stats result:', {
            captainId: result.captainId,
            status: result.status,
            isOnline: result.isOnline
        });
        
        return result;
    } catch (error) {
        throw new Error(`Failed to get captain stats: ${error.message}`);
    }
};

// Reset daily statistics (called at midnight)
module.exports.resetDailyStats = async () => {
    try {
        await captainModel.updateMany(
            {},
            {
                $set: {
                    'statistics.dailyHours': 0,
                    'statistics.dailyEarnings': 0,
                    'statistics.lastActiveDate': new Date()
                }
            }
        );
        console.log('Daily statistics reset completed');
    } catch (error) {
        console.error('Failed to reset daily statistics:', error);
    }
};

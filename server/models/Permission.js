const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    level: { type: String, required: true },
    description: { type: String }
});

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;
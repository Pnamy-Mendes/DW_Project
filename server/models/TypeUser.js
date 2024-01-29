const mongoose = require('mongoose');

const typeUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }]
});

const TypeUser = mongoose.model('TypeUser', typeUserSchema);

module.exports = TypeUser;
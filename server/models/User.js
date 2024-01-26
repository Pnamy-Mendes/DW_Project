const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    lowercaseUsername: { type: String, required: true, unique: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true }, 
    password: { type: String }, // Made optional
    githubToken: { type: String } // New field for GitHub token
});

userSchema.pre('save', function(next) {
    this.lowercaseUsername = this.username.toLowerCase();
    if (this.isModified('password') && this.password) {
        this.password = bcrypt.hashSync(this.password, 12);
    }
    next();
});

userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

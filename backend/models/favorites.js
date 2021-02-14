const mongoose = require('mongoose');
const favoriteSchema  = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    dishes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Dish',
            required: true
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('Favorites', favoriteSchema);
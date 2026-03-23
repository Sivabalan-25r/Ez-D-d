const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    projectName: { type: String, required: true },
    canvasData: { type: Object, required: true },
    published: { type: Boolean, default: false },
    publishUrl: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

// Ensure createdBy is always a member
projectSchema.pre('save', function (next) {
  const creatorId = this.createdBy.toString();
  const isMember = this.members.some((m) => m.toString() === creatorId);
  if (!isMember) {
    this.members.push(this.createdBy);
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);

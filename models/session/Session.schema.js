import mongoose from 'mongoose';

const SessionSchema = mongoose.Schema(
  {
    type: {
      type: String,
      default: 'accessJWT',
      required: true,
      max: 20,
    },

    token: {
      type: String,
      required: true,
      default: null,
      max: 100,
    },

    userID: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model('Session', SessionSchema);

export default Session;

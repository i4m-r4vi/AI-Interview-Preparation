import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema(
  {
    score: { type: Number, min: 0, max: 10 },
    feedback: String,
    strengths: [String],
    weaknesses: [String],
    suggestions: [String],
  },
  { _id: false }
);

  const questionSchema = new mongoose.Schema(
    {
      text: { type: String, required: true },
      type: {
        type: String,
        enum: ['mcq', 'theory', 'coding', 'behavioral'],
        required: true,
      },
      category: String,
      difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
      topic: String,
      order: { type: Number, required: true },
      options: [{ type: String }],
      correctAnswer: { type: String },
      answer: { type: String, default: '' },
      evaluation: evaluationSchema,
    },
    { _id: false }
  );

const summarySchema = new mongoose.Schema(
  {
    strengths: [String],
    weaknesses: [String],
    suggestions: [String],
    feedback: String,
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
    jobRole: { type: String, required: true },
    experienceLevel: {
      type: String,
      enum: ['fresher', 'junior', 'mid', 'senior'],
      required: true,
    },
    questionCount: { type: Number, default: 10 },
    questions: [questionSchema],
    currentQuestionIndex: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['in_progress', 'completed'],
      default: 'in_progress',
    },
    overallScore: { type: Number, min: 0, max: 10 },
    summary: summarySchema,
  },
  { timestamps: true }
);

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;

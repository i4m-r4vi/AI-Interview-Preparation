import mongoose from 'mongoose';

const parsedDataSchema = new mongoose.Schema(
  {
    personalDetails: {
      name: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
    },
    education: [
      {
        degree: String,
        institution: String,
        year: String,
        grade: String,
      },
    ],
    skills: [String],
    projects: [
      {
        title: String,
        description: String,
        technologies: [String],
        role: String,
      },
    ],
    experience: [
      {
        company: String,
        role: String,
        duration: String,
        responsibilities: [String],
      },
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        year: String,
      },
    ],
    technologies: [String],
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    originalFileName: { type: String, required: true },
    filePath: { type: String, required: true },
    fileType: { type: String, enum: ['pdf', 'docx'], required: true },
    parsedData: parsedDataSchema,
    status: { type: String, enum: ['pending', 'parsed', 'failed'], default: 'pending' },
    parseError: String,
  },
  { timestamps: true }
);

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;

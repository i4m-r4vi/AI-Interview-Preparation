import connectDB from '../config/db.js';
import Category from '../models/Category.js';

const defaultCategories = [
  { name: 'Frontend Developer', description: 'React, Vue, Angular, UI/UX focused roles' },
  { name: 'Backend Developer', description: 'Node.js, Java, Python, API and server-side roles' },
  { name: 'Full Stack Developer', description: 'End-to-end web development roles' },
  { name: 'Data Analyst', description: 'Data analysis, SQL, visualization roles' },
  { name: 'DevOps Engineer', description: 'CI/CD, cloud, infrastructure roles' },
  { name: 'Mobile Developer', description: 'Android, iOS, React Native roles' },
];

export async function seedCategories() {
  await connectDB();

  for (const cat of defaultCategories) {
    const exists = await Category.findOne({ name: cat.name });
    if (!exists) {
      await Category.create(cat);
      console.log('Category seeded:', cat.name);
    }
  }

  console.log('Categories seed complete');
}

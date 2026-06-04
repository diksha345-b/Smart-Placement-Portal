/**
 * Seed script to create sample HR job listings for demo/testing.
 * Run with: npm run seed:jobs
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Job = require('../models/Job');

const run = async () => {
  await connectDB();

  const hrEmail = process.env.DEMO_HR_EMAIL || 'hr@example.com';
  const hrCompany = process.env.DEMO_HR_COMPANY || 'Acme Labs';
  const hrPassword = process.env.DEMO_HR_PASSWORD || 'HrPassword123!';

  let hrUser = await User.findOne({ email: hrEmail });
  if (!hrUser) {
    hrUser = await User.create({
      name: 'Demo HR Recruiter',
      email: hrEmail,
      password: hrPassword,
      role: 'hr',
      company: hrCompany,
    });
    console.log(`Created demo HR user: ${hrEmail}`);
  } else {
    console.log(`Demo HR user already exists: ${hrEmail}`);
  }

  const sampleJobs = [
    {
      title: 'Junior Software Engineer',
      company: hrCompany,
      location: 'Remote',
      description:
        'Join our engineering team to build and ship web applications. Work closely with product and design to deliver user-facing features.',
      requiredSkills: ['JavaScript', 'React', 'Node.js'],
      jobType: 'Full-time',
      salaryRange: '$55,000 - $75,000',
      experienceLevel: 'Entry',
      status: 'Open',
    },
    {
      title: 'Product Designer',
      company: hrCompany,
      location: 'New York, NY',
      description:
        'Design intuitive user experiences for our next generation of products. Collaborate with cross-functional teams and own the end-to-end design process.',
      requiredSkills: ['Figma', 'UI/UX', 'Prototyping'],
      jobType: 'Contract',
      salaryRange: '$60,000 - $80,000',
      experienceLevel: 'Mid-level',
      status: 'Open',
    },
    {
      title: 'Data Analyst Intern',
      company: hrCompany,
      location: 'Remote',
      description:
        'Assist with data collection, analysis, and reporting to support business decisions. Ideal for students interested in analytics and dashboards.',
      requiredSkills: ['SQL', 'Python', 'Excel'],
      jobType: 'Internship',
      salaryRange: '$20/hr',
      experienceLevel: 'Internship',
      status: 'Open',
    },
  ];

  const createdJobs = [];
  for (const jobData of sampleJobs) {
    const existing = await Job.findOne({ title: jobData.title, postedBy: hrUser._id });
    if (!existing) {
      const job = await Job.create({ ...jobData, postedBy: hrUser._id });
      createdJobs.push(job);
    }
  }

  if (createdJobs.length > 0) {
    console.log(`Created ${createdJobs.length} sample job(s).`);
  } else {
    console.log('Sample jobs already exist. No new jobs were created.');
  }

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

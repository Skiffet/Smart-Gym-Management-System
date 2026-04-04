const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const GymClass = require('./models/Class');
const Booking = require('./models/Booking');
const TrainingRecord = require('./models/TrainingRecord');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    await User.deleteMany({});
    await GymClass.deleteMany({});
    await Booking.deleteMany({});
    await TrainingRecord.deleteMany({});

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@gym.com',
      password: 'password123',
      role: 'admin',
      phone: '081-111-1111',
    });

    const trainer1 = await User.create({
      name: 'John Trainer',
      email: 'trainer@gym.com',
      password: 'password123',
      role: 'trainer',
      phone: '082-222-2222',
    });

    const trainer2 = await User.create({
      name: 'Sarah Coach',
      email: 'sarah@gym.com',
      password: 'password123',
      role: 'trainer',
      phone: '082-333-3333',
    });

    const member1 = await User.create({
      name: 'Mike Member',
      email: 'member@gym.com',
      password: 'password123',
      role: 'member',
      phone: '083-444-4444',
    });

    const member2 = await User.create({
      name: 'Lisa Fitness',
      email: 'lisa@gym.com',
      password: 'password123',
      role: 'member',
      phone: '083-555-5555',
    });

    const classes = await GymClass.create([
      {
        name: 'Morning Yoga',
        description: 'Start your day with a refreshing yoga session',
        trainer: trainer1._id,
        schedule: { day: 'Monday', startTime: '07:00', endTime: '08:00' },
        capacity: 20,
        currentEnrollment: 0,
        category: 'Yoga',
      },
      {
        name: 'HIIT Blast',
        description: 'High-intensity interval training for maximum burn',
        trainer: trainer1._id,
        schedule: { day: 'Wednesday', startTime: '18:00', endTime: '19:00' },
        capacity: 15,
        currentEnrollment: 0,
        category: 'HIIT',
      },
      {
        name: 'Strength Training',
        description: 'Build muscle and strength with proper techniques',
        trainer: trainer2._id,
        schedule: { day: 'Tuesday', startTime: '10:00', endTime: '11:30' },
        capacity: 12,
        currentEnrollment: 0,
        category: 'Strength',
      },
      {
        name: 'Cardio Boxing',
        description: 'Fun and intense boxing-inspired cardio workout',
        trainer: trainer2._id,
        schedule: { day: 'Thursday', startTime: '17:00', endTime: '18:00' },
        capacity: 18,
        currentEnrollment: 0,
        category: 'Boxing',
      },
      {
        name: 'Pilates Core',
        description: 'Core strengthening and flexibility through Pilates',
        trainer: trainer1._id,
        schedule: { day: 'Friday', startTime: '09:00', endTime: '10:00' },
        capacity: 16,
        currentEnrollment: 0,
        category: 'Pilates',
      },
    ]);

    const booking1 = await Booking.create({
      member: member1._id,
      classId: classes[0]._id,
      status: 'confirmed',
    });
    classes[0].currentEnrollment = 1;
    await classes[0].save();

    const booking2 = await Booking.create({
      member: member2._id,
      classId: classes[0]._id,
      status: 'confirmed',
    });
    classes[0].currentEnrollment = 2;
    await classes[0].save();

    await Booking.create({
      member: member1._id,
      classId: classes[2]._id,
      status: 'confirmed',
    });
    classes[2].currentEnrollment = 1;
    await classes[2].save();

    await TrainingRecord.create([
      {
        member: member1._id,
        trainer: trainer1._id,
        classId: classes[0]._id,
        date: new Date('2026-03-28'),
        notes: 'Great progress on flexibility',
        exercises: [
          { name: 'Sun Salutation', sets: 3, reps: 10 },
          { name: 'Warrior Pose', sets: 2, reps: 8, duration: 30 },
        ],
        performance: 'good',
      },
      {
        member: member1._id,
        trainer: trainer2._id,
        classId: classes[2]._id,
        date: new Date('2026-03-30'),
        notes: 'Increased weight on squats',
        exercises: [
          { name: 'Squats', sets: 4, reps: 12, weight: 60 },
          { name: 'Deadlift', sets: 3, reps: 10, weight: 80 },
          { name: 'Bench Press', sets: 3, reps: 10, weight: 50 },
        ],
        performance: 'excellent',
      },
      {
        member: member2._id,
        trainer: trainer1._id,
        classId: classes[0]._id,
        date: new Date('2026-03-28'),
        notes: 'First session - needs to work on balance',
        exercises: [
          { name: 'Sun Salutation', sets: 2, reps: 8 },
          { name: 'Tree Pose', sets: 2, reps: 5, duration: 20 },
        ],
        performance: 'average',
      },
    ]);

    console.log('');
    console.log('=== Database Seeded Successfully! ===');
    console.log('');
    console.log('Login Credentials:');
    console.log('  Admin:   admin@gym.com   / password123');
    console.log('  Trainer: trainer@gym.com  / password123');
    console.log('  Trainer: sarah@gym.com    / password123');
    console.log('  Member:  member@gym.com   / password123');
    console.log('  Member:  lisa@gym.com     / password123');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();

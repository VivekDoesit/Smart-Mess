import { db } from "./index";
import { users, meals, mealResponses, foodWaste, notifications, messSettings } from "./schema";
import { sql, eq } from "drizzle-orm";

export async function seedDatabase() {
  // Check if users exist
  const existingUsers = await db.select().from(users);
  if (existingUsers.length > 0) {
    return { message: "Database already seeded" };
  }

  // 1. Insert Mess Settings
  await db.insert(messSettings).values({
    hostelName: "Kaveri Hostel Mess",
    campusName: "University Technology Campus",
    totalRegisteredStudents: 180,
    defaultBreakfastDeadline: "07:30",
    defaultLunchDeadline: "10:30",
    defaultDinnerDeadline: "17:00",
    allowLateChanges: false,
  });

  // 2. Insert Users (Admin + Students)
  const insertedUsers = await db
    .insert(users)
    .values([
      {
        name: "Aarav Sharma",
        email: "student@smartmess.demo",
        password: "demo",
        studentId: "2024CS108",
        hostel: "Kaveri Block B",
        roomNumber: "B-204",
        role: "student",
        dietaryPreference: "Vegetarian",
      },
      {
        name: "Warden Rajesh Kumar",
        email: "admin@smartmess.demo",
        password: "demo",
        studentId: "ADMIN-01",
        hostel: "Central Mess Admin Office",
        roomNumber: "Admin-101",
        role: "admin",
        dietaryPreference: "All",
      },
      {
        name: "Riya Singh",
        email: "riya.singh@campus.demo",
        password: "demo",
        studentId: "2024EE215",
        hostel: "Kaveri Block A",
        roomNumber: "A-112",
        role: "student",
        dietaryPreference: "Vegetarian",
      },
      {
        name: "Kabir Verma",
        email: "kabir.verma@campus.demo",
        password: "demo",
        studentId: "2024ME089",
        hostel: "Kaveri Block C",
        roomNumber: "C-305",
        role: "student",
        dietaryPreference: "Vegetarian",
      },
      {
        name: "Ananya Gupta",
        email: "ananya.gupta@campus.demo",
        password: "demo",
        studentId: "2024BT144",
        hostel: "Kaveri Block B",
        roomNumber: "B-108",
        role: "student",
        dietaryPreference: "Vegan",
      },
      {
        name: "Dev Patel",
        email: "dev.patel@campus.demo",
        password: "demo",
        studentId: "2024CE056",
        hostel: "Kaveri Block A",
        roomNumber: "A-220",
        role: "student",
        dietaryPreference: "Jain",
      },
      {
        name: "Meera Iyer",
        email: "meera.iyer@campus.demo",
        password: "demo",
        studentId: "2024CS031",
        hostel: "Kaveri Block B",
        roomNumber: "B-412",
        role: "student",
        dietaryPreference: "Vegetarian",
      },
      {
        name: "Rohan Nair",
        email: "rohan.nair@campus.demo",
        password: "demo",
        studentId: "2024EC078",
        hostel: "Kaveri Block C",
        roomNumber: "C-118",
        role: "student",
        dietaryPreference: "Vegetarian",
      },
    ])
    .returning();

  const studentAarav = insertedUsers.find((u) => u.email === "student@smartmess.demo")!;

  // 3. Generate Dates relative to today
  const today = new Date();
  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const days: { dateStr: string; label: string; dateObj: Date }[] = [];
  // -2 days to +4 days
  for (let i = -2; i <= 4; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      dateStr: formatDate(d),
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : i === -1 ? "Yesterday" : d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      dateObj: d,
    });
  }

  const mealTemplates = [
    {
      mealType: "breakfast",
      servingTime: "8:00 AM – 10:00 AM",
      timeOffset: "07:30",
      menuDays: [
        "Aloo Paratha, Fresh Curd, Mint Chutney, Masala Chai",
        "Idli Sambhar, Coconut Chutney, Vada, Filter Coffee",
        "Poha with Roasted Peanuts, Boiled Eggs / Banana, Ginger Tea",
        "Chole Bhature, Pickled Onions, Fresh Buttermilk",
        "Uttapam, Tomato Onion Chutney, Sambar, Green Tea",
        "Stuffed Paneer Kulcha, Curd, Pickle, Cardamom Chai",
        "Methi Thepla, Chundo, Masala Chai, Boiled Sprouts",
      ],
    },
    {
      mealType: "lunch",
      servingTime: "12:30 PM – 2:30 PM",
      timeOffset: "10:30",
      menuDays: [
        "Jeera Rice, Yellow Dal Tadka, Paneer Butter Masala, Cucumber Kachumber, Phulka Roti",
        "Veg Biryani, Mirchi Ka Salan, Boondi Raita, Roasted Papad, Gulab Jamun",
        "Steam Basmati Rice, Rajma Masala, Aloo Gobi Dry, Phulka, Green Salad",
        "Lemon Rice, Dal Palak, Bhindi Do Pyaza, Fresh Curd, Chapati",
        "Kashmiri Pulao, Kadai Paneer, Dal Fry, Roti, Fresh Sprout Salad",
        "Khichdi with Desi Ghee, Gujarati Kadhi, Aloo Chokha, Papad, Chaas",
        "Rice, Dal Makhani, Seasonal Mix Veg, Tandoori Roti, Mint Raita",
      ],
    },
    {
      mealType: "dinner",
      servingTime: "7:30 PM – 9:45 PM",
      timeOffset: "17:00",
      menuDays: [
        "Tawa Roti, Dal Makhani, Mix Vegetable Korma, Steamed Rice, Semiya Kheer",
        "Garlic Naan, Shahi Paneer, Peas Pulao, Dal Tadka, Rasgulla",
        "Chapati, Chana Masala, Baingan Bharta, Steamed Rice, Tomato Rasam",
        "Rumali Roti, Palak Paneer, Dal Kolhapuri, Jeera Rice, Moong Dal Halwa",
        "Phulka, Mushroom Mutter Curry, Yellow Dal, Steamed Rice, Fruit Custard",
        "Pav Bhaji, Extra Butter Pav, Masala Rice, Fresh Green Salad, Kulfi",
        "Laccha Paratha, Soya Chaap Masala, Dal Fry, Jeera Rice, Jalebi",
      ],
    },
  ];

  const createdMeals: any[] = [];

  for (let dIdx = 0; dIdx < days.length; dIdx++) {
    const day = days[dIdx];
    const isPast = dIdx < 2; // -2, -1
    const isToday = dIdx === 2; // 0

    for (const tpl of mealTemplates) {
      const menu = tpl.menuDays[dIdx % tpl.menuDays.length];
      
      // Calculate selection deadline
      // For today, set deadline based on hour
      const deadlineDate = new Date(day.dateObj);
      const [hours, minutes] = tpl.timeOffset.split(":").map(Number);
      deadlineDate.setHours(hours, minutes, 0, 0);

      // If it's today's dinner, ensure deadline gives users opportunity to test or view
      const deadlineIso = deadlineDate.toISOString();

      const [mealRecord] = await db
        .insert(meals)
        .values({
          mealType: tpl.mealType,
          date: day.dateStr,
          menu: menu,
          servingTime: tpl.servingTime,
          selectionDeadline: deadlineIso,
          specialNote: tpl.mealType === "dinner" && day.label === "Today" ? "Chef's Special Dessert included" : null,
        })
        .returning();

      createdMeals.push(mealRecord);
    }
  }

  // 4. Create meal responses for students across meals
  // Realistic attendance patterns:
  // Breakfast attendance: ~70%
  // Lunch attendance: ~85%
  // Dinner attendance: ~78%
  for (const meal of createdMeals) {
    for (const student of insertedUsers.filter((u) => u.role === "student")) {
      // For Aarav (demo user), provide deterministic responses for clear demo UI
      let status: "attending" | "skipping" | "not_responded" = "attending";

      if (student.email === "student@smartmess.demo") {
        if (meal.mealType === "breakfast") {
          status = "attending";
        } else if (meal.mealType === "lunch") {
          status = "skipping"; // Demo user skipped lunch (e.g. lab or outside lunch)
        } else {
          status = "attending"; // Attending dinner
        }
      } else {
        // Pseudo-random for other students to generate realistic numbers
        const hash = (student.id * 17 + meal.id * 31) % 10;
        if (hash < 6) {
          status = "attending";
        } else if (hash < 8) {
          status = "skipping";
        } else {
          status = "not_responded";
        }
      }

      await db.insert(mealResponses).values({
        studentId: student.id,
        mealId: meal.id,
        status: status,
        note: status === "skipping" ? (student.id % 2 === 0 ? "Attending afternoon seminar" : "Eating outside with project group") : null,
      });
    }
  }

  // 5. Insert Food Waste records for historical meals (-2, -1 days and today's breakfast)
  const pastMeals = createdMeals.filter((m) => m.date < days[2].dateStr || (m.date === days[2].dateStr && m.mealType === "breakfast"));
  
  const wasteData = [
    { prepared: 165, served: 154, wasted: 11, kg: 3.2, note: "Slight surplus in breakfast batter" },
    { prepared: 172, served: 168, wasted: 4, kg: 1.1, note: "Very good demand match via Smart Mess" },
    { prepared: 160, served: 148, wasted: 12, kg: 3.8, note: "Weekend evening outing" },
    { prepared: 158, served: 150, wasted: 8, kg: 2.3, note: "Managed well" },
    { prepared: 175, served: 171, wasted: 4, kg: 1.2, note: "Paneer lunch was popular" },
    { prepared: 162, served: 158, wasted: 4, kg: 1.4, note: "Accurate forecast" },
    { prepared: 150, served: 146, wasted: 4, kg: 1.0, note: "Today breakfast well balanced" },
  ];

  for (let i = 0; i < pastMeals.length && i < wasteData.length; i++) {
    const m = pastMeals[i];
    const wd = wasteData[i];
    await db.insert(foodWaste).values({
      mealId: m.id,
      date: m.date,
      mealType: m.mealType,
      preparedQuantity: wd.prepared,
      servedQuantity: wd.served,
      wastedQuantity: wd.wasted,
      wasteKg: wd.kg,
      notes: wd.note,
    });
  }

  // 6. Insert realistic notifications
  await db.insert(notifications).values([
    {
      userId: studentAarav.id,
      title: "🍽️ Dinner Preference Reminder",
      message: "Please confirm your dinner preference before 5:00 PM today. Special Chef's dessert is on the menu!",
      type: "reminder",
      read: false,
    },
    {
      userId: studentAarav.id,
      title: "🌱 You Saved 1 Meal Portion Yesterday!",
      message: "By marking yourself 'skipping' for lunch in advance, the mess saved ingredients for 1 whole meal. Thank you for eating responsibly!",
      type: "impact",
      read: true,
    },
    {
      userId: studentAarav.id,
      title: "⏰ Lunch Selection Closed",
      message: "Lunch cutoff closed at 10:30 AM. Mess staff have adjusted preparation according to final counts.",
      type: "system",
      read: true,
    },
    {
      userId: null, // Broadcast to all
      title: "📢 Weekend Special Menu Survey",
      message: "Vote for your preferred Sunday brunch specials in the hostel notice board portal.",
      type: "info",
      read: false,
    },
  ]);

  return { message: "Database seeded successfully", usersCount: insertedUsers.length, mealsCount: createdMeals.length };
}

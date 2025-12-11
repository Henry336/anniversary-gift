// ==============================================================================
// 🛠️ HENRY'S ANNIVERSARY CONFIGURATION
// ==============================================================================

export const memories = [
  // ----------------------------------------------------------------------------
  // SCENE 1: THE CONFESSION (Where you met)
  // ----------------------------------------------------------------------------
  {
    id: 1,
    title: "The First Date: The Brew", 
    date: "25 Dec 2024 - Part 1",
    // This is the location you provided
    location: [16.7973890, 96.1310212], 
    
    // Single photo (The one you have)
    image: "/photos/first-date.png", 

    description: "ကိုကို သဲသဲကို ဖွင့်ပြောခဲ့တဲ့နေရာလေးပေါ့ 😙❤️",
  },

  // ----------------------------------------------------------------------------
  // SCENE 2: THE PHOTO SHOOT (The Stack Effect!)
  // ----------------------------------------------------------------------------
  {
    id: 2,
    title: "Capturing the Moment",
    date: "25 Dec 2024 - Part 2",
    
    // ⚠️ IMPORTANT: Update this to the coordinates of the SECOND spot you went to!
    // (Right now I just shifted it slightly so the map moves)
    location: [16.8772458, 96.2065217], 
    
    // 👇 THE STACK: Put 3 photo filenames here
    images: [
      "/photos/first.png", 
      "/photos/second.png", 
      "/photos/third.png"
    ],

    description: "After the nerves settled, we went here. I remember we couldn't stop taking photos because we didn't want to forget how happy we looked.",
  },

  // ----------------------------------------------------------------------------
  // MEMORY 3: THE FAVORITE DATE (Park Bench)
  // ----------------------------------------------------------------------------
  {
    id: 3,
    title: "Our Park Bench",
    date: "14 Feb 2025",
    location: [16.7984, 96.1495], 
    image: "/photos/park-date.jpg",
    description: "We sat here for 4 hours talking about everything. The sun went down and we didn't even notice. This was the moment I realized I didn't want to be anywhere else.",
  },

  // ----------------------------------------------------------------------------
  // MEMORY 4: THE GOODBYE
  // ----------------------------------------------------------------------------
  {
    id: 4,
    title: "The Airport Promise",
    date: "Aug 2025",
    location: [16.9015, 96.1368], 
    image: "/photos/airport.jpg",
    description: "The hardest thing I've ever had to do. I promised you that the distance wouldn't matter, and that I'd work hard at NUS for our future.",
  },

  // ----------------------------------------------------------------------------
  // MEMORY 5: THE PRESENT
  // ----------------------------------------------------------------------------
  {
    id: 5,
    title: "Where I Am Now",
    date: "Today",
    location: [1.2966, 103.7764], 
    image: "/photos/dorm.jpg",
    description: "I'm sitting in my dorm right now, coding this for you. 1,900km is just a number. Every line of code here is a reminder that I'm coming back to you.",
  },
];
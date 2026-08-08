import { Scenario } from '../types';

export const PRACTICE_SCENARIOS: Scenario[] = [
  {
    id: 'coffee-ordering',
    title: 'Ordering at a Specialty Coffee Shop',
    titleZh: '咖啡馆点单与客制化需求',
    category: 'Dining',
    categoryZh: '餐饮美食',
    description: 'Order your favorite drink, specify oat milk, roast level, temperature, and ask for a pastry recommendation.',
    descriptionZh: '点一杯拿铁，要求换燕麦奶、少冰、半糖，并让店员推荐配咖烘焙小点',
    difficulty: 'Beginner',
    userRole: 'Customer',
    aiRole: 'Friendly Barista (Sam)',
    starterMessage: "Hi there! Welcome to Artisanal Roasters. What can I get started for you today?",
    goal: 'Successfully order a customized coffee and a bakery item.',
    goalZh: '成功定制一杯符合需求的咖啡并完成付费结账',
    suggestedPhrases: [
      "Can I get an iced oat milk latte, please?",
      "Could you make that half-sweet with light ice?",
      "What pastry goes best with a dark roast?",
      "Do you offer any dairy-free alternatives?"
    ],
    iconName: 'Coffee'
  },
  {
    id: 'airport-checkin',
    title: 'Airport Check-In & Window Seat Request',
    titleZh: '机场值机与托运选座',
    category: 'Travel',
    categoryZh: '旅游出行',
    description: 'Check in for an international flight, inquire about seat upgrades, and handle oversized luggage questions.',
    descriptionZh: '办理国际航班值机，询问靠窗座位与托运行李限重，沟通过境转机',
    difficulty: 'Intermediate',
    userRole: 'Passenger',
    aiRole: 'Airline Counter Agent (Rachel)',
    starterMessage: "Good morning! Welcome to SkyWay Airlines. May I please see your passport and flight booking number?",
    goal: 'Complete flight check-in and secure a window seat.',
    goalZh: '顺利完成登机牌办理并争取到满意的靠窗座位',
    suggestedPhrases: [
      "Here is my passport. Is there any window seat available towards the front?",
      "How many checked bags am I allowed for this ticket class?",
      "Will I need to pick up my luggage during my layover in Tokyo?",
      "Is the flight running on schedule today?"
    ],
    iconName: 'Plane'
  },
  {
    id: 'job-interview',
    title: 'Tech Company Job Interview (Self Intro & Project Impact)',
    titleZh: '名企英文面试：自我介绍与项目亮点',
    category: 'Career',
    categoryZh: '职场面试',
    description: 'Pitch yourself to the hiring manager, walk through a challenging project, and handle behavioral questions.',
    descriptionZh: '向面试官展现个人经验，用STAR法则讲述最具挑战性的项目与成果',
    difficulty: 'Advanced',
    userRole: 'Candidate',
    aiRole: 'Hiring Manager (Marcus)',
    starterMessage: "Thanks for joining us today! Let's kick off with a brief introduction about yourself and your recent work.",
    goal: 'Deliver a concise 2-minute self-introduction highlighting quantifiable achievements.',
    goalZh: '流畅进行2分钟Self-Intro，突出项目核心价值与解决问题的逻辑',
    suggestedPhrases: [
      "I bring over 4 years of experience specializing in full-stack web products...",
      "In my previous role, I led a initiative that boosted active retention by 25%.",
      "One of the biggest hurdles was tight deadline constraints, which we tackled by...",
      "Could you tell me more about how success is measured in this team?"
    ],
    iconName: 'Briefcase'
  },
  {
    id: 'hotel-reservation',
    title: 'Hotel Check-In & Asking for Late Check-Out',
    titleZh: '酒店入住办理与延时退房申请',
    category: 'Travel',
    categoryZh: '旅游出行',
    description: 'Check into your hotel room, ask about breakfast hours and gym amenities, and request a late check-out.',
    descriptionZh: '办理入住，询问早餐时间、健身房开放时间，并礼貌申请延迟退房',
    difficulty: 'Beginner',
    userRole: 'Hotel Guest',
    aiRole: 'Front Desk Representative (Oliver)',
    starterMessage: "Welcome to Grand Park Hotel! Are you checking in today under your reservation name?",
    goal: 'Check into the room and get late check-out approved.',
    goalZh: '完成入住登记，确认设施使用，并获得1点前的免费延迟退房',
    suggestedPhrases: [
      "Hi, I have a reservation under the name John Smith.",
      "Is it possible to request a late check-out tomorrow around 1 PM?",
      "What time is breakfast served in the morning?",
      "Could I get a room on a higher floor with a nice view?"
    ],
    iconName: 'Building'
  },
  {
    id: 'restaurant-dining',
    title: 'Fine Dining Restaurant & Dietary Preference',
    titleZh: '餐厅用餐：点菜、忌口与买单AA',
    category: 'Dining',
    categoryZh: '餐饮美食',
    description: 'Ask for chef recommendations, mention nut allergy, request steak doneness, and request separate checks.',
    descriptionZh: '请侍者推荐招牌菜，说明过敏源（花生忌口），指定牛排熟度，并申请分开买单',
    difficulty: 'Intermediate',
    userRole: 'Diner',
    aiRole: 'Attentive Waiter (Julian)',
    starterMessage: "Good evening, welcome to Bella Vista! Here are your menus. Are you ready for drinks, or need a moment?",
    goal: 'Order a 3-course meal with specific dietary requests.',
    goalZh: '完整点选前菜、主菜与甜点，清晰传达特殊饮食需求',
    suggestedPhrases: [
      "What would you recommend for someone who loves seafood?",
      "Just to be safe, I have a severe peanut allergy. Are any dishes cooked with peanut oil?",
      "I'd like the ribeye steak medium-rare, please.",
      "Could we split the bill evenly between two cards?"
    ],
    iconName: 'Utensils'
  },
  {
    id: 'casual-party-talk',
    title: 'Casual Small Talk at a Friend\'s Party',
    titleZh: '朋友聚会破冰与轻松闲聊',
    category: 'Social',
    categoryZh: '日常社交',
    description: 'Break the ice with new acquaintances, talk about hobbies, recent weekend plans, and funny stories.',
    descriptionZh: '在派对上主动打招呼破冰，聊聊工作、最近看的电影、周末计划与个人趣事',
    difficulty: 'Beginner',
    userRole: 'Party Guest',
    aiRole: 'Friendly Guest (Chloe)',
    starterMessage: "Hey! I don't think we've met yet. I'm Chloe! How do you know the host?",
    goal: 'Maintain a natural 5-minute casual conversation without awkward silence.',
    goalZh: '自然破冰对话，不让场面冷掉，交流互相兴趣与近况',
    suggestedPhrases: [
      "Nice to meet you Chloe! I actually went to university with the host.",
      "How long have you lived in the city?",
      "Have you seen any good shows on Netflix lately?",
      "That sounds awesome! What do you usually do on weekends?"
    ],
    iconName: 'Smile'
  },
  {
    id: 'doctor-appointment',
    title: 'Describing Symptoms at a Medical Clinic',
    titleZh: '诊所就医：向医生描述病情症状',
    category: 'Medical',
    categoryZh: '医疗健康',
    description: 'Explain a dull headache, fever duration, allergy history, and ask about medicine instructions.',
    descriptionZh: '清楚描述头痛、发烧持续天数与过敏史，询问处方药服用方法与注意事项',
    difficulty: 'Intermediate',
    userRole: 'Patient',
    aiRole: 'Dr. Evans',
    starterMessage: "Hello there! Come on in and sit down. What brings you in to see me today?",
    goal: 'Accurately describe your symptoms and understand dosage instructions.',
    goalZh: '准确描述自身不适，并理解医生给出的用药频次与复诊建议',
    suggestedPhrases: [
      "I've been having a throbbing headache and a mild fever for about three days.",
      "Are there any side effects I should be aware of with this antibiotic?",
      "I'm allergic to penicillin, so please keep that in mind.",
      "How many times a day should I take this medication?"
    ],
    iconName: 'Stethoscope'
  },
  {
    id: 'shopping-return',
    title: 'Shopping at a Boutique & Item Exchange',
    titleZh: '商场购物、选码与退换货沟通',
    category: 'Daily',
    categoryZh: '日常生活',
    description: 'Ask for a different size, inquire about discount promotions, and request a receipt for return policy.',
    descriptionZh: '寻找合适尺码，询问是否有打折优惠，了解30天无理由退换货规则',
    difficulty: 'Beginner',
    userRole: 'Shopper',
    aiRole: 'Store Associate (Mia)',
    starterMessage: "Hi! Let me know if you need help finding any sizes or trying anything on!",
    goal: 'Find the right size jacket and clarify the return policy.',
    goalZh: '试穿并拿到合适尺码，明确退换货凭证要求',
    suggestedPhrases: [
      "Excuse me, do you have this jacket in a medium?",
      "Is this item currently on sale or eligible for any store discounts?",
      "What is your return policy if it doesn't fit my friend?",
      "Can I get a gift receipt for this purchase?"
    ],
    iconName: 'ShoppingBag'
  }
];

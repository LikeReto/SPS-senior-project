import {
    Laptop,
    Brain,
    Shield,
    Cloud,
    Network,
    Briefcase,
    Megaphone,
    Wallet,
    Calculator,
    BarChart3,
    Users,
    Cog,
    Cpu,
    HardDrive,
    Building2,
    PenTool,
    Stethoscope,
    SmilePlus,
    Pill,
    HeartPulse,
    Scale,
    Handshake,
    Book,
    Palette,
    Newspaper,
    Globe,
    History,
    Atom,
    FlaskRound,
    Sigma,
    Dumbbell,
    Hotel,
    Camera,
    Video,
    Toolbox,
    Zap,
    Hammer,
    Code,
    Music,
    Brush,
    Heart,
    Paw,
} from "lucide-react-native";

// Degree list with icons
export const degrees = [
    {
        title: "High School",
        icon: "school-outline",
        emoji: "🎓",
        label: { en: "High School", ar: "الثانوية العامة" }
    },
    {
        title: "Diploma",
        icon: "ribbon-outline",
        emoji: "🎗️",
        label: { en: "Diploma", ar: "الدبلوم" }
    },
    {
        title: "Bachelor",
        icon: "school",
        emoji: "🎓",
        label: { en: "Bachelor", ar: "البكالوريوس" }
    },
    {
        title: "Master",
        icon: "medal-outline",
        emoji: "🏅",
        label: { en: "Master", ar: "الماجستير" }
    },
    {
        title: "PhD",
        icon: "trophy-outline",
        emoji: "🏆",
        label: { en: "PhD", ar: "الدكتوراه" }
    },
];


// Expanded worldwide fields
export const fields = [
    // Computer & IT
    { name: "Computer Science", icon: Laptop, emoji: "💻", label: { en: "Computer Science", ar: "علوم الحاسوب" } },
    { name: "Software Engineering", icon: Cpu, emoji: "🖥️", label: { en: "Software Engineering", ar: "هندسة البرمجيات" } },
    { name: "Information Technology", icon: HardDrive, label: { en: "Information Technology", ar: "تكنولوجيا المعلومات" } },
    { name: "Cybersecurity", icon: Shield, label: { en: "Cybersecurity", ar: "الأمن السيبراني" } },
    { name: "Artificial Intelligence", icon: Brain, label: { en: "Artificial Intelligence", ar: "الذكاء الاصطناعي" } },
    { name: "Data Science", icon: BarChart3, label: { en: "Data Science", ar: "علوم البيانات" } },
    { name: "Machine Learning", icon: Brain, label: { en: "Machine Learning", ar: "تعلم الآلة" } },
    { name: "Cloud Computing", icon: Cloud, label: { en: "Cloud Computing", ar: "الحوسبة السحابية" } },
    { name: "Network Engineering", icon: Network, label: { en: "Network Engineering", ar: "هندسة الشبكات" } },
    { name: "Computer Engineering", emoji: "💻", label: { en: "Computer Engineering", ar: "هندسة الحاسوب" } },
    { name: "Game Development", emoji: "🎮", label: { en: "Game Development", ar: "تطوير الألعاب" } },
    { name: "Robotics", emoji: "🤖", label: { en: "Robotics", ar: "الروبوتات" } },
    { name: "Animation", emoji: "🎬", label: { en: "Animation", ar: "الرسوم المتحركة" } },
    { name: "Web Development", emoji: "🌐", label: { en: "Web Development", ar: "تطوير الويب" } },
    { name: "Mobile Development", emoji: "📱", label: { en: "Mobile Development", ar: "تطوير التطبيقات" } },
    { name: "UI/UX Design", icon: PenTool, label: { en: "UI/UX Design", ar: "تصميم واجهات وتجربة المستخدم" } },
    { name: "Software Testing & QA", emoji: "✅", label: { en: "Software Testing & QA", ar: "اختبار البرمجيات وضمان الجودة" } },

    // Business & Finance
    { name: "Business Administration", icon: Briefcase, label: { en: "Business Administration", ar: "إدارة الأعمال" } },
    { name: "Marketing", icon: Megaphone, label: { en: "Marketing", ar: "التسويق" } },
    { name: "Finance", icon: Wallet, label: { en: "Finance", ar: "المالية" } },
    { name: "Accounting", icon: Calculator, label: { en: "Accounting", ar: "المحاسبة" } },
    { name: "Economics", icon: BarChart3, label: { en: "Economics", ar: "الاقتصاد" } },
    { name: "Human Resources", icon: Users, label: { en: "Human Resources", ar: "الموارد البشرية" } },
    { name: "International Business", icon: Globe, label: { en: "International Business", ar: "الأعمال الدولية" } },
    { name: "Entrepreneurship", icon: Briefcase, label: { en: "Entrepreneurship", ar: "ريادة الأعمال" } },
    { name: "Supply Chain Management", emoji: "🚚", label: { en: "Supply Chain Management", ar: "إدارة سلسلة الإمداد" } },
    { name: "Hospitality Management", icon: Hotel, label: { en: "Hospitality Management", ar: "إدارة الضيافة" } },

    // Engineering
    { name: "Mechanical Engineering", icon: Cog, label: { en: "Mechanical Engineering", ar: "الهندسة الميكانيكية" } },
    { name: "Electrical Engineering", icon: Cpu, label: { en: "Electrical Engineering", ar: "الهندسة الكهربائية" } },
    { name: "Electronics Engineering", icon: HardDrive, label: { en: "Electronics Engineering", ar: "الهندسة الإلكترونية" } },
    { name: "Civil Engineering", icon: Building2, label: { en: "Civil Engineering", ar: "الهندسة المدنية" } },
    { name: "Industrial Engineering", icon: Cog, label: { en: "Industrial Engineering", ar: "الهندسة الصناعية" } },
    { name: "Chemical Engineering", icon: FlaskRound, label: { en: "Chemical Engineering", ar: "الهندسة الكيميائية" } },
    { name: "Architecture", icon: Building2, label: { en: "Architecture", ar: "الهندسة المعمارية" } },
    { name: "Interior Design", icon: PenTool, label: { en: "Interior Design", ar: "تصميم داخلي" } },
    { name: "Aerospace Engineering", emoji: "✈️", label: { en: "Aerospace Engineering", ar: "الهندسة الفضائية" } },
    { name: "Environmental Engineering", emoji: "🌱", label: { en: "Environmental Engineering", ar: "الهندسة البيئية" } },
    { name: "Automotive Engineering", emoji: "🚗", label: { en: "Automotive Engineering", ar: "الهندسة السيارات" } },

    // Medical & Health
    { name: "Medicine", icon: Stethoscope, label: { en: "Medicine", ar: "الطب" } },
    { name: "Dentistry", icon: SmilePlus, label: { en: "Dentistry", ar: "طب الأسنان" } },
    { name: "Pharmacy", icon: Pill, label: { en: "Pharmacy", ar: "الصيدلة" } },
    { name: "Nursing", icon: HeartPulse, label: { en: "Nursing", ar: "التمريض" } },
    { name: "Physiotherapy", icon: Dumbbell, label: { en: "Physiotherapy", ar: "العلاج الطبيعي" } },
    { name: "Public Health", icon: HeartPulse, label: { en: "Public Health", ar: "الصحة العامة" } },
    { name: "Nutrition & Dietetics", emoji: "🥗", label: { en: "Nutrition & Dietetics", ar: "التغذية" } },
    { name: "Psychology", icon: Brain, label: { en: "Psychology", ar: "علم النفس" } },
    { name: "Veterinary Science", emoji: "🐾", label: { en: "Veterinary Science", ar: "الطب البيطري" } },

    // Law & Social Sciences
    { name: "Law", icon: Scale, label: { en: "Law", ar: "القانون" } },
    { name: "Sociology", icon: Handshake, label: { en: "Sociology", ar: "علم الاجتماع" } },
    { name: "Education", icon: Book, label: { en: "Education", ar: "التربية والتعليم" } },
    { name: "Political Science", icon: Globe, label: { en: "Political Science", ar: "العلوم السياسية" } },
    { name: "Social Work", emoji: "🤝", label: { en: "Social Work", ar: "العمل الاجتماعي" } },
    { name: "Anthropology", emoji: "🧬", label: { en: "Anthropology", ar: "الأنثروبولوجيا" } },
    { name: "International Relations", icon: Globe, label: { en: "International Relations", ar: "العلاقات الدولية" } },
    { name: "History", icon: History, label: { en: "History", ar: "التاريخ" } },

    // Arts & Media
    { name: "Graphic Design", icon: Palette, label: { en: "Graphic Design", ar: "التصميم الجرافيكي" } },
    { name: "Journalism", icon: Newspaper, label: { en: "Journalism", ar: "الصحافة" } },
    { name: "Media & Communication", icon: Globe, label: { en: "Media & Communication", ar: "الإعلام والاتصال" } },
    { name: "Film & Television", emoji: "🎥", label: { en: "Film & Television", ar: "السينما والتلفزيون" } },
    { name: "Music", emoji: "🎵", label: { en: "Music", ar: "الموسيقى" } },
    { name: "Performing Arts", emoji: "🎭", label: { en: "Performing Arts", ar: "الفنون الأدائية" } },
    { name: "Photography", emoji: "📸", label: { en: "Photography", ar: "التصوير" } },

    // Science & Math
    { name: "Biology", icon: Atom, label: { en: "Biology", ar: "علم الأحياء" } },
    { name: "Physics", icon: Atom, label: { en: "Physics", ar: "الفيزياء" } },
    { name: "Chemistry", icon: FlaskRound, label: { en: "Chemistry", ar: "الكيمياء" } },
    { name: "Mathematics", icon: Sigma, label: { en: "Mathematics", ar: "الرياضيات" } },
    { name: "Statistics", icon: BarChart3, label: { en: "Statistics", ar: "الإحصاء" } },
    { name: "Astronomy", emoji: "🌌", label: { en: "Astronomy", ar: "علم الفلك" } },
    { name: "Geology", emoji: "⛏️", label: { en: "Geology", ar: "الجيولوجيا" } },
    { name: "Environmental Science", emoji: "🌿", label: { en: "Environmental Science", ar: "العلوم البيئية" } },

    // Sports & Wellness
    { name: "Sports Science", icon: Dumbbell, label: { en: "Sports Science", ar: "علوم الرياضة" } },
    { name: "Physical Education", icon: Dumbbell, label: { en: "Physical Education", ar: "التربية البدنية" } },
    { name: "Yoga & Wellness", emoji: "🧘", label: { en: "Yoga & Wellness", ar: "اليوغا والصحة" } },
    { name: "Kinesiology", emoji: "🏃", label: { en: "Kinesiology", ar: "علم الحركة" } },

    // Others / Catch-All
    { name: "Culinary Arts", emoji: "👨‍🍳", label: { en: "Culinary Arts", ar: "فنون الطهي" } },
    { name: "Fashion Design", emoji: "👗", label: { en: "Fashion Design", ar: "تصميم الأزياء" } },
    { name: "Event Management", emoji: "🎉", label: { en: "Event Management", ar: "إدارة الفعاليات" } },
    { name: "Tourism & Travel", emoji: "✈️", label: { en: "Tourism & Travel", ar: "السياحة والسفر" } },
    { name: "Linguistics", emoji: "🗣️", label: { en: "Linguistics", ar: "اللغويات" } },
    { name: "Library Science", emoji: "📚", label: { en: "Library Science", ar: "علوم المكتبات" } },
    { name: "Journalism & Media Studies", emoji: "📰", label: { en: "Journalism & Media Studies", ar: "دراسات الإعلام والصحافة" } },
];




// ---- Popular skills list with icons and emojis ----
export const skillsList = [
  // Programming & IT
  { name: "Programming", icon: Code, emoji: "💻", label: { en: "Programming", ar: "برمجة" } },
  { name: "Web Development", icon: Laptop, emoji: "🌐", label: { en: "Web Development", ar: "تطوير الويب" } },
  { name: "Mobile Development", icon: Cpu, emoji: "📱", label: { en: "Mobile Development", ar: "تطوير تطبيقات الجوال" } },
  { name: "UI/UX Design", icon: PenTool, emoji: "🎨", label: { en: "UI/UX Design", ar: "تصميم واجهة المستخدم وتجربة المستخدم" } },
  { name: "Graphic Design", icon: Palette, emoji: "🖌️", label: { en: "Graphic Design", ar: "التصميم الجرافيكي" } },
  { name: "Animation", icon: Brush, emoji: "🎬", label: { en: "Animation", ar: "الرسوم المتحركة" } },
  { name: "Game Development", icon: null, emoji: "🎮", label: { en: "Game Development", ar: "تطوير الألعاب" } },
  { name: "Data Analysis", icon: BarChart3, emoji: "📊", label: { en: "Data Analysis", ar: "تحليل البيانات" } },
  { name: "Machine Learning", icon: Brain, emoji: "🤖", label: { en: "Machine Learning", ar: "التعلم الآلي" } },
  { name: "Cybersecurity", icon: Shield, emoji: "🛡️", label: { en: "Cybersecurity", ar: "الأمن السيبراني" } },
  { name: "Cloud Computing", icon: Cloud, emoji: "☁️", label: { en: "Cloud Computing", ar: "الحوسبة السحابية" } },
  { name: "Networking", icon: Network, emoji: "🌐", label: { en: "Networking", ar: "الشبكات" } },
  { name: "Software Testing", icon: Cpu, emoji: "✅", label: { en: "Software Testing", ar: "اختبار البرمجيات" } },

  // Business & Marketing
  { name: "Marketing", icon: Megaphone, emoji: "📣", label: { en: "Marketing", ar: "التسويق" } },
  { name: "Social Media Management", icon: Globe, emoji: "📱", label: { en: "Social Media Management", ar: "إدارة وسائل التواصل الاجتماعي" } },
  { name: "SEO", icon: BarChart3, emoji: "🔍", label: { en: "SEO", ar: "تحسين محركات البحث" } },
  { name: "Finance", icon: Wallet, emoji: "💰", label: { en: "Finance", ar: "المالية" } },
  { name: "Accounting", icon: Calculator, emoji: "🧾", label: { en: "Accounting", ar: "المحاسبة" } },
  { name: "Human Resources", icon: Users, emoji: "👥", label: { en: "Human Resources", ar: "الموارد البشرية" } },
  { name: "Business Analysis", icon: Briefcase, emoji: "📈", label: { en: "Business Analysis", ar: "تحليل الأعمال" } },
  { name: "Project Management", icon: Briefcase, emoji: "📋", label: { en: "Project Management", ar: "إدارة المشاريع" } },

  // Arts & Media
  { name: "Photography", icon: Camera, emoji: "📸", label: { en: "Photography", ar: "التصوير الفوتوغرافي" } },
  { name: "Video Editing", icon: Video, emoji: "🎥", label: { en: "Video Editing", ar: "تحرير الفيديو" } },
  { name: "Music Production", icon: Music, emoji: "🎵", label: { en: "Music Production", ar: "إنتاج الموسيقى" } },
  { name: "Writing", icon: Book, emoji: "✍️", label: { en: "Writing", ar: "الكتابة" } },
  { name: "Journalism", icon: Newspaper, emoji: "📰", label: { en: "Journalism", ar: "الصحافة" } },
  { name: "Content Creation", icon: PenTool, emoji: "📝", label: { en: "Content Creation", ar: "إنشاء المحتوى" } },

  // Engineering & Technical
  { name: "Plumbing", icon: Toolbox, emoji: "🚰", label: { en: "Plumbing", ar: "السباكة" } },
  { name: "Electrician", icon: Zap, emoji: "⚡", label: { en: "Electrician", ar: "الكهرباء" } },
  { name: "Carpentry", icon: Hammer, emoji: "🪚", label: { en: "Carpentry", ar: "النجارة" } },
  { name: "Mechanical Engineering", icon: Cog, emoji: "⚙️", label: { en: "Mechanical Engineering", ar: "الهندسة الميكانيكية" } },
  { name: "Civil Engineering", icon: Building2, emoji: "🏗️", label: { en: "Civil Engineering", ar: "الهندسة المدنية" } },
  { name: "Chemical Engineering", icon: FlaskRound, emoji: "⚗️", label: { en: "Chemical Engineering", ar: "الهندسة الكيميائية" } },
  { name: "Electrical Engineering", icon: Cpu, emoji: "🔌", label: { en: "Electrical Engineering", ar: "الهندسة الكهربائية" } },

  // Health & Wellness
  { name: "Nursing", icon: HeartPulse, emoji: "❤️", label: { en: "Nursing", ar: "التمريض" } },
  { name: "Physiotherapy", icon: Dumbbell, emoji: "💪", label: { en: "Physiotherapy", ar: "العلاج الطبيعي" } },
  { name: "Public Health", icon: Stethoscope, emoji: "🩺", label: { en: "Public Health", ar: "الصحة العامة" } },
  { name: "Nutrition", icon: Heart, emoji: "🥗", label: { en: "Nutrition", ar: "التغذية" } },
  { name: "Psychology", icon: Brain, emoji: "🧠", label: { en: "Psychology", ar: "علم النفس" } },
  { name: "Veterinary", icon: Paw, emoji: "🐾", label: { en: "Veterinary", ar: "الطب البيطري" } },

  // Miscellaneous / Popular Skills
  { name: "Culinary Arts", icon: null, emoji: "👨‍🍳", label: { en: "Culinary Arts", ar: "فن الطهي" } },
  { name: "Fashion Design", icon: null, emoji: "👗", label: { en: "Fashion Design", ar: "تصميم الأزياء" } },
  { name: "Event Management", icon: null, emoji: "🎉", label: { en: "Event Management", ar: "إدارة الفعاليات" } },
  { name: "Tourism & Travel", icon: null, emoji: "✈️", label: { en: "Tourism & Travel", ar: "السياحة والسفر" } },
  { name: "Language Translation", icon: Book, emoji: "🈯", label: { en: "Language Translation", ar: "الترجمة" } },
  { name: "Tutoring", icon: Book, emoji: "📚", label: { en: "Tutoring", ar: "التدريس الخصوصي" } },
  { name: "Handicrafts", icon: Brush, emoji: "🧵", label: { en: "Handicrafts", ar: "الأعمال اليدوية" } },
];



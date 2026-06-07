import { InvitationData } from './types';

export const INITIAL_INVITATION_DATA: InvitationData = {
  groom: {
    nameEn: "Md. Ataur Rahman",
    nameBn: "মোঃ আতাউর রহমান",
    fatherEn: "Late Asmot Ali Sorkar",
    fatherBn: "মরহুম আছমত আলী সরকার",
    motherEn: "Mst. Amina Khatun",
    motherBn: "মোছাঃ আমিনা খাঁতুন",
    villEn: "Donukandi",
    villBn: "ধনকান্দি",
    poEn: "Shahporan",
    poBn: "শাহপরান",
    distEn: "Sylhet",
    distBn: "সিলেট",
    wardEn: "Ward No: 33",
    wardBn: "৩৩নং ওয়ার্ড",
  },
  bride: {
    nameEn: "Mahdia Akter",
    nameBn: "মাহদিয়া আক্তার",
    fatherEn: "Ala Uddin",
    fatherBn: "আলা উদ্দিন",
    motherEn: "Fuljan Begum",
    motherBn: "ফুলজান বেগম",
    villEn: "Chhatrapur",
    villBn: "ছত্রপুর",
    poEn: "Gachbari Bazar",
    poBn: "গাছবাড়ি বাজার",
    thanaEn: "Kanaighat",
    thanaBn: "কানাইঘাট",
    distEn: "Sylhet",
    distBn: "সিলেট",
  },
  bismillahEn: "In the name of Allah, the Most Gracious, the Most Merciful",
  bismillahBn: "পরম করুণাময় অসীম দয়ালু আল্লাহর নামে",
  quranArabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنْفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
  quranEn: "And among His signs is that He created for you spouses from among yourselves that you may find tranquility in them; and He placed between you affection and mercy.",
  quranBn: "আর তাঁর নিদর্শনাবলীর মধ্যে একটি হলো, তিনি তোমাদের জন্য তোমাদের মধ্য থেকেই সঙ্গিনী সৃষ্টি করেছেন, যাতে তোমরা তাদের কাছে প্রশান্তি পাও, এবং তিনি তোমাদের মধ্যে ভালোবাসা ও দয়া সৃষ্টি করেছেন।",
  nikah: {
    nameEn: "Nikah & Borjatra Ceremony",
    nameBn: "বিবাহ ও আকদ অনুষ্ঠান (বরযাত্রা)",
    dateEn: "Friday, June 19, 2026",
    dateBn: "শুক্রবার, ১৯ জুন, ২০২৬ ইং",
    timeEn: "02:00 PM (Groom departure at 11:30 AM)",
    timeBn: "দুপুর ০২:০০ ঘটিকায় (বরযাত্রা বেলা ১১:৩০ মিনিটে বরের বাড়ী হইতে)",
    venueEn: "Rahman Community Center",
    venueBn: "রহমান কমিউনিটি সেন্টার",
    addressEn: "Gachbari Bazar, Kanaighat, Sylhet",
    addressBn: "গাছবাড়ি বাজার, কানাইঘাট, সিলেট",
    mapLink: "https://maps.google.com/?q=Rahman+Community+Center+Gachbari+Sylhet",
    timeDetailsEn: "Guests are requested to arrive by 1:30 PM. Feast starts at 2:00 PM.",
    timeDetailsBn: "মেহমানদের দুপুর ০১:৩০ মিনিটের মধ্যে উপস্থিত হয়ে বরযাত্রী দলকে স্বাগত জানানোর অনুরোধ করা হলো। ভোজ শুরু দুপুর ০২:০০ ঘটিকায়।",
  },
  walima: {
    nameEn: "Walima Reception",
    nameBn: "ওয়ালিমা অনুষ্ঠান (বধূবরণ)",
    dateEn: "Saturday, June 20, 2026",
    dateBn: "শনিবার, ২০ জুন, ২০২৬ ইং",
    timeEn: "01:30 PM onwards",
    timeBn: "দুপুর০১:৩০ ঘটিকা হইতে",
    venueEn: "Suchana Community Center",
    venueBn: "সূচনা কমিউনিটি সেন্টার",
    addressEn: "Khadimpara, Sylhet",
    addressBn: "খাদিমপাড়া, সিলেট",
    mapLink: "https://maps.google.com/?q=Suchana+Community+Center+Khadimpara+Sylhet",
    timeDetailsEn: "Feast starts from 1:30 PM. Please bless the newlywed couple.",
    timeDetailsBn: "মধ্যাহ্নভোজ দুপুর ০১:৩০ মিনিট হইতে শুরু হবে। দম্পতির শুভজীবনের জন্য দোয়া কাম্য।",
  }
};

export const INITIAL_WISHES = [
  {
    id: "1",
    name: "Hasan Al Mahmud",
    relation: "Groom's Friend",
    message: "May Allah bless your marriage and unite you both in goodness. Heartiest congratulations to Ataur bhai!",
    createdAt: "2026-06-06T10:30:00Z"
  },
  {
    id: "2",
    name: "Tahsina Akter",
    relation: "Bride's Cousin",
    message: "মাশাআল্লাহ্, অত্যন্ত সুন্দর দাওয়াত কার্ড! মাহদিয়া ও আতাউর ভাইয়ের বিবাহিত জীবনের জন্য অনেক অনেক শুভকামনা ও দোয়া রইল।",
    createdAt: "2026-06-06T12:15:00Z"
  },
  {
    id: "3",
    name: "Dr. Ahmed Jamil",
    relation: "Family Friend",
    message: "بارَكَ اللهُ لَكُما وَبارَكَ عَلَيْكُما وَجَمَعَ بَيْنَكُما فِي خَيْرٍ. Wishing you a lifetime of happiness, peace, and spiritual growth.",
    createdAt: "2026-06-06T14:40:00Z"
  }
];

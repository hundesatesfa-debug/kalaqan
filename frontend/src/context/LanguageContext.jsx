import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navbar
    home: 'Home',
    rules: 'Rules',
    signIn: 'Sign In',
    joinNow: 'Join Now',
    searchEvents: 'Search events...',
    
    // Home Hero
    ultimatePlatform: 'The Ultimate Entertainment Platform',
    heroTitleLine1: 'Make The Judges',
    heroTitleLine2: 'Laugh',
    heroSubtitle: 'Do you have what it takes to crack up our elite panel of judges? Register today to take the stage and make them burst into laughter!',
    upcomingEvent: 'Upcoming Event',
    
    // Rules
    rulesHeader: 'Rules & Requirements',
    rulesSub: 'Master the rules to conquer the stage. Bring your best material!',
    rule1Title: 'Make Them Laugh',
    rule1Desc: 'Your goal is to get a genuine laugh, chuckle, or smile from the judges within your time limit.',
    rule2Title: 'Stage Presence',
    rule2Desc: 'Engage the room and maintain direct eye contact with the judges. Keep the energy high!',
    rule3Title: 'Original Material',
    rule3Desc: 'Deliver original stand-up comedy, jokes, or acts. Plagiarism of existing routines is strictly prohibited.',
    
    // Register
    joinShow: 'Join The Show',
    registerNow: 'Register Now',
    registerSub: 'Fill out the form below to secure your spot to take the stage and make the judges laugh!',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    age: 'Age',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    city: 'City / Region',
    occupation: 'Occupation',
    occupationPlaceholder: 'Standup Comedian, Writer, Student',
    submit: 'Submit Registration',
    processing: 'Processing...',
    successMsg: 'Application submitted! Get ready for the stage.',
    errorMsg: 'Error occurred. Please try again.',
    
    // Footer
    footerDesc: 'The ultimate entertainment platform. Bring your best jokes, take the stage, and make the judges laugh!',
    quickLinks: 'Quick Links',
    aboutUs: 'About Us',
    contact: 'Contact',
    followUs: 'Follow Us',
    allRightsReserved: 'All rights reserved.',
    
    // Other
    days: 'Days',
    hours: 'Hours',
    mins: 'Mins',
    secs: 'Secs',
  },
  ao: {
    // Navbar
    home: 'Mana',
    rules: 'Seera',
    signIn: 'Seeni',
    joinNow: 'Nu Wajjin Ta\'i',
    searchEvents: 'Sagantaa Barbaadi...',
    
    // Home Hero
    ultimatePlatform: 'Waltajjii Bashannanaa Addaa',
    heroTitleLine1: 'Abbootii Seeraa',
    heroTitleLine2: 'Kolfisiisi',
    heroSubtitle: 'Abbootii seeraa filatamoo kolfisiisuuf dandeettii qabda? Har\'a galmaayi, waltajjii irratti bahii kolfaan kolfisiisi!',
    upcomingEvent: 'Sagantaa Itti Aanu',
    
    // Rules
    rulesHeader: 'Seera fi Ulaagaalee',
    rulesSub: 'Waltajjii injifachuuf seera beeki. Qophii kee isa caalu fidi!',
    rule1Title: 'Kolfisiisi',
    rule1Desc: 'Galmi kee yeroo siif kenname keessatti abbootii seeraa kolfisiisuu fi kolfa dhugaa irraa argachuudha.',
    rule2Title: 'Miira Waltajjii',
    rule2Desc: 'Kutaa sana ofitti haqi, abbootii seeraa wajjin ilaalaa turii, anniisaa waltajjichaa ol kaasi!',
    rule3Title: 'Qophii Keetiin',
    rule3Desc: 'Komedi fi baacoowwan mataa keetii fidi. Qophii namoota biroo irraa waraabuu dhoorkaadha.',
    
    // Register
    joinShow: 'Saganticha Wajjin Hiriiri',
    registerNow: 'Amma Galmaayi',
    registerSub: 'Waltajjii irratti bahuudhaan abbootii seeraa kolfisiisuuf ammasumaan galmaayi!',
    fullName: 'Maqaa Guutuu',
    phoneNumber: 'Lakk. Bilbilaa',
    age: 'Umrii',
    gender: 'Saala',
    male: 'Dhiira',
    female: 'Dubara',
    other: 'Kan Biroo',
    city: 'Magaalaa / Naannoo',
    occupation: 'Hojii',
    occupationPlaceholder: 'Komediantii, Barreessaa, Barataa',
    submit: 'Galmee Ergi',
    processing: 'Adeemsarra jira...',
    successMsg: 'Iyyannoon kee fudhatameera! Waltajjiif qophaa\'i.',
    errorMsg: 'Dogoggorri uumameera. Maaloo irra deebi\'ii yaali.',
    
    // Footer
    footerDesc: 'Waltajjii bashannanaa addaa. Qoosaa kee isa caalu fidi, waltajjii irratti bahii abbootii seeraa kolfisiisi!',
    quickLinks: 'Liinkiiwwan Saffisaa',
    aboutUs: 'Waa\'ee Keenya',
    contact: 'Quunnama',
    followUs: 'Nu Hordofaa',
    allRightsReserved: 'Mirgi qabeenyummaa seeraan eeggamaadha.',
    
    // Other
    days: 'Guyyaa',
    hours: 'Sa\'aatii',
    mins: 'Daqiiqaa',
    secs: 'Sekondii',
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ao' : 'en');
  };

  const t = (key) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

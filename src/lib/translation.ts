/**
 * Translation Service for PetInsureX
 * Provides cached, offline-first translation for full page multilingual support
 * Independent of SEA-LION API - works immediately without external dependencies
 */

import { useState, useEffect } from 'react';

export type SupportedLanguage = 'en' | 'th' | 'singlish' | 'ms' | 'id';

export interface TranslationConfig {
  fallbackLanguage: SupportedLanguage;
  enableCache: boolean;
  cacheExpiry: number; // in milliseconds
  supportedLanguages: SupportedLanguage[];
}

export interface TranslationEntry {
  key: string;
  translations: Record<SupportedLanguage, string>;
  category?: string;
  context?: string;
}

class TranslationService {
  private static instance: TranslationService;
  private config: TranslationConfig;
  private translations: Map<string, Record<SupportedLanguage, string>>;
  private currentLanguage: SupportedLanguage = 'en';
  private cache: Map<string, { data: string; timestamp: number }>;
  private observers: Set<(lang: SupportedLanguage) => void>;

  constructor(config?: Partial<TranslationConfig>) {
    this.config = {
      fallbackLanguage: 'en',
      enableCache: true,
      cacheExpiry: 24 * 60 * 60 * 1000, // 24 hours
      supportedLanguages: ['en', 'th', 'singlish', 'ms', 'id'],
      ...config
    };
    
    this.translations = new Map();
    this.cache = new Map();
    this.observers = new Set();
    
    // Initialize with browser language if available
    this.initializeLanguage();
    this.loadTranslations();
  }

  public static getInstance(config?: Partial<TranslationConfig>): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService(config);
    }
    return TranslationService.instance;
  }

  /**
   * Initialize language from browser/localStorage
   */
  private initializeLanguage(): void {
    try {
      // Check localStorage first
      const savedLang = localStorage.getItem('petinsurex-language') as SupportedLanguage;
      if (savedLang && this.config.supportedLanguages.includes(savedLang)) {
        this.currentLanguage = savedLang;
        return;
      }

      // Detect from browser
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('th')) {
        this.currentLanguage = 'th';
      } else if (browserLang.startsWith('ms')) {
        this.currentLanguage = 'ms';
      } else if (browserLang.startsWith('id')) {
        this.currentLanguage = 'id';
      } else {
        this.currentLanguage = 'en'; // Default fallback
      }
    } catch (error) {
      console.warn('Failed to initialize language:', error);
      this.currentLanguage = this.config.fallbackLanguage;
    }
  }

  /**
   * Load translation dictionaries
   */
  private loadTranslations(): void {
    // Core UI translations - immediately available
    const coreTranslations: TranslationEntry[] = [
      {
        key: 'nav.dashboard',
        translations: {
          en: 'Dashboard',
          th: 'แดชบอร์ด',
          singlish: 'Dashboard lah',
          ms: 'Papan Pemuka',
          id: 'Dasbor'
        }
      },
      {
        key: 'nav.policies',
        translations: {
          en: 'Policies',
          th: 'กรมธรรม์',
          singlish: 'Policies',
          ms: 'Polisi',
          id: 'Kebijakan'
        }
      },
      {
        key: 'nav.claims',
        translations: {
          en: 'Claims',
          th: 'การเคลม',
          singlish: 'Claims',
          ms: 'Tuntutan',
          id: 'Klaim'
        }
      },
      {
        key: 'nav.ai_assistant',
        translations: {
          en: 'AI Assistant',
          th: 'ผู้ช่วย AI',
          singlish: 'AI Helper',
          ms: 'Pembantu AI',
          id: 'Asisten AI'
        }
      },
      {
        key: 'nav.pet_identity',
        translations: {
          en: 'Pet Identity',
          th: 'ข้อมูลสัตว์เลี้ยง',
          singlish: 'Pet ID',
          ms: 'Identiti Haiwan',
          id: 'Identitas Hewan'
        }
      },
      {
        key: 'common.submit',
        translations: {
          en: 'Submit',
          th: 'ส่ง',
          singlish: 'Submit lah',
          ms: 'Hantar',
          id: 'Kirim'
        }
      },
      {
        key: 'common.cancel',
        translations: {
          en: 'Cancel',
          th: 'ยกเลิก',
          singlish: 'Cancel',
          ms: 'Batal',
          id: 'Batal'
        }
      },
      {
        key: 'common.save',
        translations: {
          en: 'Save',
          th: 'บันทึก',
          singlish: 'Save',
          ms: 'Simpan',
          id: 'Simpan'
        }
      },
      {
        key: 'common.loading',
        translations: {
          en: 'Loading...',
          th: 'กำลังโหลด...',
          singlish: 'Loading lah...',
          ms: 'Memuatkan...',
          id: 'Memuat...'
        }
      },
      {
        key: 'common.error',
        translations: {
          en: 'Error',
          th: 'ข้อผิดพลาด',
          singlish: 'Error lah',
          ms: 'Ralat',
          id: 'Kesalahan'
        }
      },
      {
        key: 'ai.service_unavailable',
        translations: {
          en: 'AI Service Temporarily Unavailable',
          th: 'บริการ AI ชั่วคราวไม่พร้อมใช้งาน',
          singlish: 'AI Service down lah, wait awhile',
          ms: 'Perkhidmatan AI Tidak Tersedia Buat Masa Ini',
          id: 'Layanan AI Sementara Tidak Tersedia'
        }
      },
      {
        key: 'ai.fallback_message',
        translations: {
          en: 'Showing sample response while service is restored',
          th: 'แสดงตัวอย่างการตอบขณะที่เรากำลังซ่อมแซมบริการ',
          singlish: 'Show sample first, real one coming soon',
          ms: 'Menunjukkan respons sampel semasa perkhidmatan dipulihkan',
          id: 'Menampilkan contoh respons saat layanan diperbaiki'
        }
      },
      {
        key: 'policy.coverage',
        translations: {
          en: 'Coverage',
          th: 'ความคุ้มครอง',
          singlish: 'Coverage',
          ms: 'Perlindungan',
          id: 'Perlindungan'
        }
      },
      {
        key: 'policy.premium',
        translations: {
          en: 'Premium',
          th: 'เบี้ยประกัน',
          singlish: 'Premium',
          ms: 'Premium',
          id: 'Premi'
        }
      },
      {
        key: 'claims.status',
        translations: {
          en: 'Claim Status',
          th: 'สถานะการเคลม',
          singlish: 'Claim Status',
          ms: 'Status Tuntutan',
          id: 'Status Klaim'
        }
      },
      {
        key: 'claims.submit_new',
        translations: {
          en: 'Submit New Claim',
          th: 'ยื่นเคลมใหม่',
          singlish: 'Submit New Claim',
          ms: 'Hantar Tuntutan Baru',
          id: 'Ajukan Klaim Baru'
        }
      },
      // AI Assistant translations
      {
        key: 'ai.welcome_configured',
        translations: {
          en: "Hello! I'm your AI pet insurance assistant powered by SEA-LION AI. I specialize in Southeast Asian contexts and can communicate in multiple languages including English, Singlish, Thai (ภาษาไทย), Bahasa Malaysia, and Bahasa Indonesia. I can help you with claims processing, policy questions, pet health advice, fraud detection, and emergency support.\n\n🔧 *Note: The SEA-LION API service is currently experiencing connectivity issues, so I'll provide helpful fallback responses until it's restored.*\n\nHow can I assist you today? 🐾",
          th: "สวัสดีค่ะ! ฉันเป็นผู้ช่วย AI ประกันสัตว์เลี้ยงของคุณ ขับเคลื่อนด้วย SEA-LION AI ฉันเชี่ยวชาญในบริบทเอเชียตะวันออกเฉียงใต้ และสื่อสารได้หลายภาษา รวมถึงอังกฤษ Singlish ไทย มาเลย์ และอินโดนีเซีย ฉันสามารถช่วยเหลือเรื่องการประมวลผลเคลม คำถามเกี่ยวกับกรมธรรม์ คำแนะนำด้านสุขภาพสัตว์เลี้ยง การตรวจจับการฉ้อโกง และการสนับสนุนฉุกเฉิน\n\n🔧 *หมายเหตุ: บริการ SEA-LION API กำลังมีปัญหาการเชื่อมต่อ ฉันจะให้การตอบกลับสำรองที่เป็นประโยชน์จนกว่าจะฟื้นฟู*\n\nฉันจะช่วยอะไรคุณได้บ้างวันนี้ค่ะ? 🐾",
          singlish: "Hello lah! I'm your AI pet insurance assistant powered by SEA-LION AI. I specialize in Southeast Asian contexts and can talk in multiple languages - English, Singlish, Thai, Bahasa Malaysia, and Bahasa Indonesia. I can help you with claims processing, policy questions, pet health advice, fraud detection, and emergency support lah.\n\n🔧 *Note: The SEA-LION API service having some connection issues now, so I'll give you helpful backup responses until it's working again.*\n\nHow can I help you today? 🐾",
          ms: "Hello! Saya adalah pembantu AI insurans haiwan peliharaan anda yang dikuasakan oleh SEA-LION AI. Saya pakar dalam konteks Asia Tenggara dan boleh berkomunikasi dalam pelbagai bahasa termasuk Bahasa Inggeris, Singlish, Thai, Bahasa Malaysia, dan Bahasa Indonesia. Saya boleh membantu dengan pemprosesan tuntutan, soalan polisi, nasihat kesihatan haiwan peliharaan, pengesanan penipuan, dan sokongan kecemasan.\n\n🔧 *Nota: Perkhidmatan SEA-LION API sedang mengalami isu sambungan, jadi saya akan memberikan respons sandaran yang berguna sehingga dipulihkan.*\n\nBagaimana saya boleh membantu anda hari ini? 🐾",
          id: "Halo! Saya adalah asisten AI asuransi hewan peliharaan Anda yang didukung oleh SEA-LION AI. Saya mengkhususkan diri dalam konteks Asia Tenggara dan dapat berkomunikasi dalam berbagai bahasa termasuk Bahasa Inggris, Singlish, Thai, Bahasa Malaysia, dan Bahasa Indonesia. Saya dapat membantu dengan pemrosesan klaim, pertanyaan polis, saran kesehatan hewan peliharaan, deteksi penipuan, dan dukungan darurat.\n\n🔧 *Catatan: Layanan SEA-LION API sedang mengalami masalah koneksi, jadi saya akan memberikan respons cadangan yang membantu sampai dipulihkan.*\n\nBagaimana saya bisa membantu Anda hari ini? 🐾"
        }
      },
      {
        key: 'ai.welcome_demo',
        translations: {
          en: "Hello! I'm your AI pet insurance assistant running in demo mode. I can help you with claims, policy questions, pet health advice, and fraud detection using sample responses. For full AI capabilities, please configure the SEA-LION API key. How can I assist you today?",
          th: "สวัสดีค่ะ! ฉันเป็นผู้ช่วย AI ประกันสัตว์เลี้ยงที่ทำงานในโหมดทดสอบ ฉันสามารถช่วยเหลือเรื่องเคลม คำถามเกี่ยวกับกรมธรรม์ คำแนะนำด้านสุขภาพสัตว์เลี้ยง และการตรวจจับการฉ้อโกงโดยใช้ตัวอย่างการตอบ สำหรับความสามารถ AI เต็มรูปแบบ โปรดกำหนดค่า SEA-LION API key ฉันจะช่วยอะไรคุณได้บ้างวันนี้ค่ะ?",
          singlish: "Hello! I'm your AI pet insurance assistant running in demo mode lah. I can help you with claims, policy questions, pet health advice, and fraud detection using sample responses. For full AI power, need to configure the SEA-LION API key first. How can I help you today?",
          ms: "Hello! Saya adalah pembantu AI insurans haiwan peliharaan yang berjalan dalam mod demo. Saya boleh membantu dengan tuntutan, soalan polisi, nasihat kesihatan haiwan peliharaan, dan pengesanan penipuan menggunakan respons sampel. Untuk keupayaan AI penuh, sila konfigurasikan kunci API SEA-LION. Bagaimana saya boleh membantu anda hari ini?",
          id: "Halo! Saya adalah asisten AI asuransi hewan peliharaan yang berjalan dalam mode demo. Saya dapat membantu dengan klaim, pertanyaan polis, saran kesehatan hewan peliharaan, dan deteksi penipuan menggunakan respons sampel. Untuk kemampuan AI penuh, harap konfigurasikan kunci API SEA-LION. Bagaimana saya bisa membantu Anda hari ini?"
        }
      },
      {
        key: 'ai.powered_by',
        translations: {
          en: 'Powered by advanced AI for intelligent pet insurance support',
          th: 'ขับเคลื่อนด้วย AI ขั้นสูงเพื่อการสนับสนุนประกันสัตว์เลี้ยงอย่างชาญฉลาด',
          singlish: 'Powered by advanced AI for smart pet insurance support lah',
          ms: 'Dikuasakan oleh AI canggih untuk sokongan insurans haiwan peliharaan yang bijak',
          id: 'Didukung oleh AI canggih untuk dukungan asuransi hewan peliharaan yang cerdas'
        }
      },
      // AI Actions
      {
        key: 'ai.actions.check_coverage',
        translations: {
          en: 'Check Policy Coverage',
          th: 'ตรวจสอบความคุ้มครองกรมธรรม์',
          singlish: 'Check Policy Coverage',
          ms: 'Semak Perlindungan Polisi',
          id: 'Periksa Perlindungan Polis'
        }
      },
      {
        key: 'ai.actions.claim_status',
        translations: {
          en: 'Claim Status Update',
          th: 'อัปเดตสถานะเคลม',
          singlish: 'Claim Status Update',
          ms: 'Kemas Kini Status Tuntutan',
          id: 'Update Status Klaim'
        }
      },
      {
        key: 'ai.actions.emergency',
        translations: {
          en: 'Pet Health Emergency',
          th: 'เหตุฉุกเฉินสุขภาพสัตว์เลี้ยง',
          singlish: 'Pet Health Emergency',
          ms: 'Kecemasan Kesihatan Haiwan',
          id: 'Darurat Kesehatan Hewan'
        }
      },
      {
        key: 'ai.actions.find_vet',
        translations: {
          en: 'Find Emergency Vet',
          th: 'หาสัตวแพทย์ฉุกเฉิน',
          singlish: 'Find Emergency Vet',
          ms: 'Cari Doktor Veterinar Kecemasan',
          id: 'Cari Dokter Hewan Darurat'
        }
      },
      {
        key: 'ai.actions.wellness',
        translations: {
          en: 'Wellness Checkup',
          th: 'ตรวจสุขภาพ',
          singlish: 'Wellness Checkup',
          ms: 'Pemeriksaan Kesihatan',
          id: 'Pemeriksaan Kesehatan'
        }
      },
      {
        key: 'ai.actions.analyze_bill',
        translations: {
          en: 'Analyze Vet Bill',
          th: 'วิเคราะห์ใบเสร็จสัตวแพทย์',
          singlish: 'Analyze Vet Bill',
          ms: 'Analisis Bil Veterinar',
          id: 'Analisis Tagihan Dokter Hewan'
        }
      },
      // Service Status
      {
        key: 'service.status.healthy',
        translations: {
          en: 'Healthy',
          th: 'ปกติ',
          singlish: 'Healthy',
          ms: 'Sihat',
          id: 'Sehat'
        }
      },
      {
        key: 'service.status.degraded',
        translations: {
          en: 'Degraded',
          th: 'มีปัญหา',
          singlish: 'Got Problem',
          ms: 'Terdegradasi',
          id: 'Terdegradasi'
        }
      },
      {
        key: 'service.status.down',
        translations: {
          en: 'Down',
          th: 'ไม่พร้อมใช้งาน',
          singlish: 'Down',
          ms: 'Tidak Berfungsi',
          id: 'Tidak Berfungsi'
        }
      },
      {
        key: 'service.checking',
        translations: {
          en: 'Checking service status...',
          th: 'กำลังตรวจสอบสถานะบริการ...',
          singlish: 'Checking service status...',
          ms: 'Memeriksa status perkhidmatan...',
          id: 'Memeriksa status layanan...'
        }
      },
      {
        key: 'service.ai_service_status',
        translations: {
          en: 'AI Service Status',
          th: 'สถานะบริการ AI',
          singlish: 'AI Service Status',
          ms: 'Status Perkhidmatan AI',
          id: 'Status Layanan AI'
        }
      },
      {
        key: 'service.last_checked',
        translations: {
          en: 'Last checked',
          th: 'ตรวจสอบล่าสุด',
          singlish: 'Last checked',
          ms: 'Diperiksa terakhir',
          id: 'Terakhir diperiksa'
        }
      },
      {
        key: 'service.available_models',
        translations: {
          en: 'Available Models',
          th: 'โมเดลที่พร้อมใช้งาน',
          singlish: 'Available Models',
          ms: 'Model Yang Tersedia',
          id: 'Model yang Tersedia'
        }
      },
      {
        key: 'service.errors',
        translations: {
          en: 'Errors',
          th: 'ข้อผิดพลาด',
          singlish: 'Errors',
          ms: 'Ralat',
          id: 'Kesalahan'
        }
      },
      // Time translations
      {
        key: 'time.just_now',
        translations: {
          en: 'Just now',
          th: 'เมื่อกี้นี้',
          singlish: 'Just now',
          ms: 'Baru sahaja',
          id: 'Baru saja'
        }
      }
    ];

    // Load core translations
    coreTranslations.forEach(entry => {
      this.translations.set(entry.key, entry.translations);
    });

    console.log(`🌍 Translation service initialized with ${coreTranslations.length} entries`);
  }

  /**
   * Get current language
   */
  public getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  /**
   * Set current language and notify observers
   */
  public setLanguage(lang: SupportedLanguage): void {
    if (!this.config.supportedLanguages.includes(lang)) {
      console.warn(`Unsupported language: ${lang}, falling back to ${this.config.fallbackLanguage}`);
      lang = this.config.fallbackLanguage;
    }

    const oldLang = this.currentLanguage;
    this.currentLanguage = lang;

    // Persist to localStorage
    try {
      localStorage.setItem('petinsurex-language', lang);
    } catch (error) {
      console.warn('Failed to save language preference:', error);
    }

    // Notify observers if language changed
    if (oldLang !== lang) {
      this.observers.forEach(callback => callback(lang));
    }
  }

  /**
   * Translate a key to current language
   */
  public t(key: string, fallback?: string): string {
    const translations = this.translations.get(key);
    
    if (!translations) {
      console.warn(`Translation key not found: ${key}`);
      return fallback || key;
    }

    return translations[this.currentLanguage] || 
           translations[this.config.fallbackLanguage] || 
           fallback || 
           key;
  }

  /**
   * Translate with interpolation
   */
  public t_interpolate(key: string, params: Record<string, string | number>, fallback?: string): string {
    let text = this.t(key, fallback);
    
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(new RegExp(`\\{\\{${param}\\}\\}`, 'g'), String(value));
    });
    
    return text;
  }

  /**
   * Get all supported languages
   */
  public getSupportedLanguages(): SupportedLanguage[] {
    return [...this.config.supportedLanguages];
  }

  /**
   * Subscribe to language changes
   */
  public onLanguageChange(callback: (lang: SupportedLanguage) => void): () => void {
    this.observers.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.observers.delete(callback);
    };
  }

  /**
   * Add translations dynamically
   */
  public addTranslations(entries: TranslationEntry[]): void {
    entries.forEach(entry => {
      this.translations.set(entry.key, entry.translations);
    });
    
    console.log(`🌍 Added ${entries.length} translation entries`);
  }

  /**
   * Get language display name
   */
  public getLanguageDisplayName(lang: SupportedLanguage): string {
    const displayNames: Record<SupportedLanguage, string> = {
      en: 'English',
      th: 'ไทย',
      singlish: 'Singlish',
      ms: 'Bahasa Malaysia',
      id: 'Bahasa Indonesia'
    };
    
    return displayNames[lang] || lang;
  }

  /**
   * Check if language is RTL (none of our supported languages are RTL, but good to have)
   */
  public isRTL(lang?: SupportedLanguage): boolean {
    const rtlLanguages: SupportedLanguage[] = []; // None for now
    return rtlLanguages.includes(lang || this.currentLanguage);
  }

  /**
   * Export translations for debugging
   */
  public exportTranslations(): Record<string, Record<SupportedLanguage, string>> {
    const result: Record<string, Record<SupportedLanguage, string>> = {};
    this.translations.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
}

// Export singleton instance
export const translationService = TranslationService.getInstance();

// Export helper hook for React components
export function useTranslation() {
  const [currentLang, setCurrentLang] = useState(translationService.getCurrentLanguage());
  
  useEffect(() => {
    const unsubscribe = translationService.onLanguageChange(setCurrentLang);
    return unsubscribe;
  }, []);

  return {
    t: translationService.t.bind(translationService),
    t_interpolate: translationService.t_interpolate.bind(translationService),
    currentLanguage: currentLang,
    setLanguage: translationService.setLanguage.bind(translationService),
    supportedLanguages: translationService.getSupportedLanguages(),
    getLanguageDisplayName: translationService.getLanguageDisplayName.bind(translationService)
  };
}
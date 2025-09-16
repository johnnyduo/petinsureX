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
      // Dashboard translations
      {
        key: 'dashboard.welcome_title',
        translations: {
          en: 'Welcome back!',
          th: 'ยินดีต้อนรับกลับ!',
          singlish: 'Welcome back lah!',
          ms: 'Selamat kembali!',
          id: 'Selamat datang kembali!'
        }
      },
      {
        key: 'dashboard.welcome_subtitle',
        translations: {
          en: 'Your pets are protected and healthy. Here\'s what\'s happening today.',
          th: 'สัตว์เลี้ยงของคุณได้รับการคุ้มครองและมีสุขภาพดี นี่คือสิ่งที่เกิดขึ้นในวันนี้',
          singlish: 'Your pets all protected and healthy. Here\'s what happening today lah.',
          ms: 'Haiwan peliharaan anda dilindungi dan sihat. Inilah yang berlaku hari ini.',
          id: 'Hewan peliharaan Anda terlindungi dan sehat. Inilah yang terjadi hari ini.'
        }
      },
      {
        key: 'dashboard.stats.active_policies',
        translations: {
          en: 'Active Policies',
          th: 'กรมธรรม์ที่ใช้งาน',
          singlish: 'Active Policies',
          ms: 'Polisi Aktif',
          id: 'Polis Aktif'
        }
      },
      {
        key: 'dashboard.stats.claims_processed',
        translations: {
          en: 'Claims Processed',
          th: 'เคลมที่ดำเนินการ',
          singlish: 'Claims Processed',
          ms: 'Tuntutan Diproses',
          id: 'Klaim Diproses'
        }
      },
      {
        key: 'dashboard.stats.total_saved',
        translations: {
          en: 'Total Saved',
          th: 'ประหยัดรวม',
          singlish: 'Total Saved',
          ms: 'Jumlah Disimpan',
          id: 'Total Dihemat'
        }
      },
      {
        key: 'dashboard.stats.health_score',
        translations: {
          en: 'Health Score',
          th: 'คะแนนสุขภาพ',
          singlish: 'Health Score',
          ms: 'Skor Kesihatan',
          id: 'Skor Kesehatan'
        }
      },
      {
        key: 'dashboard.quick_actions',
        translations: {
          en: 'Quick Actions',
          th: 'การกระทำด่วน',
          singlish: 'Quick Actions',
          ms: 'Tindakan Cepat',
          id: 'Tindakan Cepat'
        }
      },
      {
        key: 'dashboard.submit_claim',
        translations: {
          en: 'Submit Claim',
          th: 'ยื่นเคลม',
          singlish: 'Submit Claim',
          ms: 'Hantar Tuntutan',
          id: 'Ajukan Klaim'
        }
      },
      {
        key: 'dashboard.submit_claim_desc',
        translations: {
          en: 'Quick claim processing',
          th: 'ประมวลผลเคลมอย่างรวดเร็ว',
          singlish: 'Quick claim processing',
          ms: 'Pemprosesan tuntutan pantas',
          id: 'Pemrosesan klaim cepat'
        }
      },
      {
        key: 'dashboard.update_photos',
        translations: {
          en: 'Update Photos',
          th: 'อัปเดตรูปภาพ',
          singlish: 'Update Photos',
          ms: 'Kemas Kini Foto',
          id: 'Perbarui Foto'
        }
      },
      {
        key: 'dashboard.update_photos_desc',
        translations: {
          en: 'Pet identity verification',
          th: 'การยืนยันตัวตนสัตว์เลี้ยง',
          singlish: 'Pet identity verification',
          ms: 'Pengesahan identiti haiwan peliharaan',
          id: 'Verifikasi identitas hewan peliharaan'
        }
      },
      {
        key: 'dashboard.recent_activity',
        translations: {
          en: 'Recent Activity',
          th: 'กิจกรรมล่าสุด',
          singlish: 'Recent Activity',
          ms: 'Aktiviti Terkini',
          id: 'Aktivitas Terbaru'
        }
      },
      {
        key: 'dashboard.my_pets',
        translations: {
          en: 'My Pets',
          th: 'สัตว์เลี้ยงของฉัน',
          singlish: 'My Pets',
          ms: 'Haiwan Peliharaan Saya',
          id: 'Hewan Peliharaan Saya'
        }
      },
      {
        key: 'dashboard.ai_insights',
        translations: {
          en: 'AI Insights',
          th: 'ข้อมูลเชิงลึก AI',
          singlish: 'AI Insights',
          ms: 'Wawasan AI',
          id: 'Wawasan AI'
        }
      },
      {
        key: 'dashboard.coverage',
        translations: {
          en: 'Coverage',
          th: 'ความคุ้มครอง',
          singlish: 'Coverage',
          ms: 'Perlindungan',
          id: 'Perlindungan'
        }
      },
      {
        key: 'dashboard.remaining',
        translations: {
          en: 'Remaining',
          th: 'คงเหลือ',
          singlish: 'Remaining',
          ms: 'Baki',
          id: 'Sisa'
        }
      },
      {
        key: 'dashboard.next_due',
        translations: {
          en: 'Next Due',
          th: 'ครบกำหนดต่อไป',
          singlish: 'Next Due',
          ms: 'Tempoh Seterusnya',
          id: 'Jatuh Tempo Berikutnya'
        }
      },
      {
        key: 'dashboard.healthy',
        translations: {
          en: 'Healthy',
          th: 'สุขภาพดี',
          singlish: 'Healthy',
          ms: 'Sihat',
          id: 'Sehat'
        }
      },
      {
        key: 'dashboard.new_pet',
        translations: {
          en: 'New Pet',
          th: 'สัตว์เลี้ยงใหม่',
          singlish: 'New Pet',
          ms: 'Haiwan Peliharaan Baru',
          id: 'Hewan Peliharaan Baru'
        }
      },
      // Claims page translations
      {
        key: 'claims.title',
        translations: {
          en: 'Claims Management',
          th: 'การจัดการเคลม',
          singlish: 'Claims Management',
          ms: 'Pengurusan Tuntutan',
          id: 'Manajemen Klaim'
        }
      },
      {
        key: 'claims.subtitle',
        translations: {
          en: 'Track and manage your insurance claims with AI-powered processing',
          th: 'ติดตามและจัดการเคลมประกันของคุณด้วยการประมวลผลที่ขับเคลื่อนด้วย AI',
          singlish: 'Track and manage your insurance claims with AI-powered processing lah',
          ms: 'Jejaki dan urus tuntutan insurans anda dengan pemprosesan dikuasakan AI',
          id: 'Lacak dan kelola klaim asuransi Anda dengan pemrosesan bertenaga AI'
        }
      },
      {
        key: 'claims.emergency_surgery',
        translations: {
          en: 'Emergency surgery',
          th: 'ผ่าตัดฉุกเฉิน',
          singlish: 'Emergency surgery',
          ms: 'Pembedahan kecemasan',
          id: 'Operasi darurat'
        }
      },
      {
        key: 'claims.routine_checkup',
        translations: {
          en: 'Routine checkup',
          th: 'ตรวจสุขภาพทั่วไป',
          singlish: 'Routine checkup',
          ms: 'Pemeriksaan rutin',
          id: 'Pemeriksaan rutin'
        }
      },
      {
        key: 'claims.status.review',
        translations: {
          en: 'Under Review',
          th: 'อยู่ระหว่างการพิจารณา',
          singlish: 'Under Review',
          ms: 'Dalam Semakan',
          id: 'Dalam Peninjauan'
        }
      },
      {
        key: 'claims.status.paid',
        translations: {
          en: 'Paid',
          th: 'จ่ายแล้ว',
          singlish: 'Paid',
          ms: 'Dibayar',
          id: 'Dibayar'
        }
      },
      {
        key: 'claims.status.pending',
        translations: {
          en: 'Pending',
          th: 'รอดำเนินการ',
          singlish: 'Pending',
          ms: 'Tertunda',
          id: 'Tertunda'
        }
      },
      {
        key: 'claims.view_details',
        translations: {
          en: 'View Details',
          th: 'ดูรายละเอียด',
          singlish: 'View Details',
          ms: 'Lihat Butiran',
          id: 'Lihat Detail'
        }
      },
      {
        key: 'claims.download_invoice',
        translations: {
          en: 'Download Invoice',
          th: 'ดาวน์โหลดใบแจ้งหนี้',
          singlish: 'Download Invoice',
          ms: 'Muat Turun Invois',
          id: 'Unduh Faktur'
        }
      },
      {
        key: 'claims.fraud_score',
        translations: {
          en: 'Fraud Score',
          th: 'คะแนนการฉ้อโกง',
          singlish: 'Fraud Score',
          ms: 'Skor Penipuan',
          id: 'Skor Penipuan'
        }
      },
      {
        key: 'claims.pet_match_confidence',
        translations: {
          en: 'Pet Match Confidence',
          th: 'ความมั่นใจในการจับคู่สัตว์เลี้ยง',
          singlish: 'Pet Match Confidence',
          ms: 'Keyakinan Padanan Haiwan',
          id: 'Kepercayaan Kecocokan Hewan'
        }
      },
      // Policies page translations
      {
        key: 'policies.title',
        translations: {
          en: 'Policy Management',
          th: 'การจัดการกรมธรรม์',
          singlish: 'Policy Management',
          ms: 'Pengurusan Polisi',
          id: 'Manajemen Polis'
        }
      },
      {
        key: 'policies.subtitle',
        translations: {
          en: 'Manage your pet insurance policies and coverage',
          th: 'จัดการกรมธรรม์ประกันสัตว์เลี้ยงและความคุ้มครองของคุณ',
          singlish: 'Manage your pet insurance policies and coverage lah',
          ms: 'Urus polisi insurans haiwan peliharaan dan perlindungan anda',
          id: 'Kelola polis asuransi hewan peliharaan dan perlindungan Anda'
        }
      },
      {
        key: 'policies.get_coverage',
        translations: {
          en: 'Get Coverage',
          th: 'รับความคุ้มครอง',
          singlish: 'Get Coverage',
          ms: 'Dapatkan Perlindungan',
          id: 'Dapatkan Perlindungan'
        }
      },
      {
        key: 'policies.monthly',
        translations: {
          en: 'monthly',
          th: 'ต่อเดือน',
          singlish: 'monthly',
          ms: 'bulanan',
          id: 'bulanan'
        }
      },
      {
        key: 'policies.basic_plan',
        translations: {
          en: 'PetInsureX Basic',
          th: 'PetInsureX เบสิก',
          singlish: 'PetInsureX Basic',
          ms: 'PetInsureX Asas',
          id: 'PetInsureX Dasar'
        }
      },
      {
        key: 'policies.standard_plan',
        translations: {
          en: 'PetInsureX Standard',
          th: 'PetInsureX มาตรฐาน',
          singlish: 'PetInsureX Standard',
          ms: 'PetInsureX Standard',
          id: 'PetInsureX Standar'
        }
      },
      {
        key: 'policies.premium_plan',
        translations: {
          en: 'PetInsureX Premium',
          th: 'PetInsureX พรีเมียม',
          singlish: 'PetInsureX Premium',
          ms: 'PetInsureX Premium',
          id: 'PetInsureX Premium'
        }
      },
      {
        key: 'policies.accident_coverage',
        translations: {
          en: 'Accident Coverage',
          th: 'ความคุ้มครองอุบัติเหตุ',
          singlish: 'Accident Coverage',
          ms: 'Perlindungan Kemalangan',
          id: 'Perlindungan Kecelakaan'
        }
      },
      {
        key: 'policies.emergency_surgery',
        translations: {
          en: 'Emergency Surgery',
          th: 'ผ่าตัดฉุกเฉิน',
          singlish: 'Emergency Surgery',
          ms: 'Pembedahan Kecemasan',
          id: 'Operasi Darurat'
        }
      },
      {
        key: 'policies.illness_coverage',
        translations: {
          en: 'Illness Coverage',
          th: 'ความคุ้มครองการเจ็บป่วย',
          singlish: 'Illness Coverage',
          ms: 'Perlindungan Penyakit',
          id: 'Perlindungan Penyakit'
        }
      },
      {
        key: 'policies.wellness_exams',
        translations: {
          en: 'Wellness Exams',
          th: 'การตรวจสุขภาพ',
          singlish: 'Wellness Exams',
          ms: 'Pemeriksaan Kesihatan',
          id: 'Pemeriksaan Kesehatan'
        }
      },
      {
        key: 'policies.dental_care',
        translations: {
          en: 'Dental Care',
          th: 'การดูแลฟัน',
          singlish: 'Dental Care',
          ms: 'Penjagaan Gigi',
          id: 'Perawatan Gigi'
        }
      },
      {
        key: 'common.next',
        translations: {
          en: 'Next',
          th: 'ถัดไป',
          singlish: 'Next',
          ms: 'Seterusnya',
          id: 'Selanjutnya'
        }
      },
      {
        key: 'common.previous',
        translations: {
          en: 'Previous',
          th: 'ก่อนหน้า',
          singlish: 'Previous',
          ms: 'Sebelumnya',
          id: 'Sebelumnya'
        }
      },
      {
        key: 'common.continue',
        translations: {
          en: 'Continue',
          th: 'ดำเนินการต่อ',
          singlish: 'Continue',
          ms: 'Teruskan',
          id: 'Lanjutkan'
        }
      },
      {
        key: 'common.close',
        translations: {
          en: 'Close',
          th: 'ปิด',
          singlish: 'Close',
          ms: 'Tutup',
          id: 'Tutup'
        }
      },
      {
        key: 'common.select',
        translations: {
          en: 'Select',
          th: 'เลือก',
          singlish: 'Select',
          ms: 'Pilih',
          id: 'Pilih'
        }
      },
      {
        key: 'common.update',
        translations: {
          en: 'Update',
          th: 'อัปเดต',
          singlish: 'Update',
          ms: 'Kemas Kini',
          id: 'Perbarui'
        }
      },
      {
        key: 'common.edit',
        translations: {
          en: 'Edit',
          th: 'แก้ไข',
          singlish: 'Edit',
          ms: 'Edit',
          id: 'Edit'
        }
      },
      {
        key: 'common.delete',
        translations: {
          en: 'Delete',
          th: 'ลบ',
          singlish: 'Delete',
          ms: 'Padam',
          id: 'Hapus'
        }
      },
      {
        key: 'common.upload',
        translations: {
          en: 'Upload',
          th: 'อัปโหลด',
          singlish: 'Upload',
          ms: 'Muat Naik',
          id: 'Unggah'
        }
      },
      {
        key: 'common.download',
        translations: {
          en: 'Download',
          th: 'ดาวน์โหลด',
          singlish: 'Download',
          ms: 'Muat Turun',
          id: 'Unduh'
        }
      },
      {
        key: 'common.view',
        translations: {
          en: 'View',
          th: 'ดู',
          singlish: 'View',
          ms: 'Lihat',
          id: 'Lihat'
        }
      },
      {
        key: 'common.search',
        translations: {
          en: 'Search',
          th: 'ค้นหา',
          singlish: 'Search',
          ms: 'Cari',
          id: 'Cari'
        }
      },
      {
        key: 'common.filter',
        translations: {
          en: 'Filter',
          th: 'กรอง',
          singlish: 'Filter',
          ms: 'Tapis',
          id: 'Saring'
        }
      },
      {
        key: 'common.reset',
        translations: {
          en: 'Reset',
          th: 'รีเซ็ต',
          singlish: 'Reset',
          ms: 'Reset',
          id: 'Reset'
        }
      },
      {
        key: 'common.refresh',
        translations: {
          en: 'Refresh',
          th: 'รีเฟรช',
          singlish: 'Refresh',
          ms: 'Segar Semula',
          id: 'Segarkan'
        }
      },
      // Modal and form translations
      {
        key: 'modal.claim.title',
        translations: {
          en: 'Submit New Claim',
          th: 'ยื่นเคลมใหม่',
          singlish: 'Submit New Claim',
          ms: 'Hantar Tuntutan Baru',
          id: 'Ajukan Klaim Baru'
        }
      },
      {
        key: 'modal.claim.step_pet_selection',
        translations: {
          en: 'Pet Selection',
          th: 'เลือกสัตว์เลี้ยง',
          singlish: 'Pet Selection',
          ms: 'Pemilihan Haiwan',
          id: 'Pemilihan Hewan'
        }
      },
      {
        key: 'modal.claim.step_claim_details',
        translations: {
          en: 'Claim Details',
          th: 'รายละเอียดเคลม',
          singlish: 'Claim Details',
          ms: 'Butiran Tuntutan',
          id: 'Detail Klaim'
        }
      },
      {
        key: 'modal.claim.step_treatment_info',
        translations: {
          en: 'Treatment Info',
          th: 'ข้อมูลการรักษา',
          singlish: 'Treatment Info',
          ms: 'Maklumat Rawatan',
          id: 'Info Perawatan'
        }
      },
      {
        key: 'modal.claim.step_upload_documents',
        translations: {
          en: 'Upload Documents',
          th: 'อัปโหลดเอกสาร',
          singlish: 'Upload Documents',
          ms: 'Muat Naik Dokumen',
          id: 'Unggah Dokumen'
        }
      },
      {
        key: 'modal.claim.step_review_submit',
        translations: {
          en: 'Review & Submit',
          th: 'ทบทวนและส่ง',
          singlish: 'Review & Submit',
          ms: 'Semak & Hantar',
          id: 'Tinjau & Kirim'
        }
      },
      {
        key: 'modal.claim.select_pet_title',
        translations: {
          en: 'Select Pet for Claim',
          th: 'เลือกสัตว์เลี้ยงสำหรับเคลม',
          singlish: 'Select Pet for Claim',
          ms: 'Pilih Haiwan untuk Tuntutan',
          id: 'Pilih Hewan untuk Klaim'
        }
      },
      {
        key: 'modal.claim.remaining_coverage',
        translations: {
          en: 'Remaining coverage',
          th: 'ความคุ้มครองที่เหลือ',
          singlish: 'Remaining coverage',
          ms: 'Baki perlindungan',
          id: 'Sisa perlindungan'
        }
      },
      {
        key: 'modal.claim.ready_to_submit',
        translations: {
          en: 'Ready to Submit',
          th: 'พร้อมส่งแล้ว',
          singlish: 'Ready to Submit',
          ms: 'Sedia untuk Hantar',
          id: 'Siap untuk Dikirim'
        }
      },
      {
        key: 'modal.claim.processing_note',
        translations: {
          en: 'Your claim will be processed by our AI system and you\'ll receive an update within 2-3 minutes.',
          th: 'เคลมของคุณจะได้รับการประมวลผลโดยระบบ AI ของเรา และคุณจะได้รับการอัปเดตภายใน 2-3 นาที',
          singlish: 'Your claim will be processed by our AI system and you\'ll get update within 2-3 minutes lah.',
          ms: 'Tuntutan anda akan diproses oleh sistem AI kami dan anda akan menerima kemas kini dalam 2-3 minit.',
          id: 'Klaim Anda akan diproses oleh sistem AI kami dan Anda akan menerima pembaruan dalam 2-3 menit.'
        }
      },
      {
        key: 'modal.photos.title',
        translations: {
          en: 'Update Pet Photos',
          th: 'อัปเดตรูปภาพสัตว์เลี้ยง',
          singlish: 'Update Pet Photos',
          ms: 'Kemas Kini Foto Haiwan',
          id: 'Perbarui Foto Hewan'
        }
      },
      {
        key: 'modal.photos.step_select_pet',
        translations: {
          en: 'Select Pet',
          th: 'เลือกสัตว์เลี้ยง',
          singlish: 'Select Pet',
          ms: 'Pilih Haiwan',
          id: 'Pilih Hewan'
        }
      },
      {
        key: 'modal.photos.step_upload_photos',
        translations: {
          en: 'Upload Photos',
          th: 'อัปโหลดรูปภาพ',
          singlish: 'Upload Photos',
          ms: 'Muat Naik Foto',
          id: 'Unggah Foto'
        }
      },
      {
        key: 'modal.photos.step_review',
        translations: {
          en: 'Review',
          th: 'ทบทวน',
          singlish: 'Review',
          ms: 'Semak',
          id: 'Tinjau'
        }
      },
      // Landing page translations
      {
        key: 'landing.hero_title',
        translations: {
          en: 'AI-Powered Pet Insurance for Southeast Asia',
          th: 'ประกันสัตว์เลี้ยงขับเคลื่อนด้วย AI สำหรับเอเชียตะวันออกเฉียงใต้',
          singlish: 'AI-Powered Pet Insurance for Southeast Asia lah',
          ms: 'Insurans Haiwan Peliharaan Dikuasakan AI untuk Asia Tenggara',
          id: 'Asuransi Hewan Peliharaan Bertenaga AI untuk Asia Tenggara'
        }
      },
      {
        key: 'landing.hero_subtitle',
        translations: {
          en: 'Protect your furry family with intelligent, multilingual insurance that understands Southeast Asian pet care',
          th: 'ปกป้องครอบครัวขนฟูของคุณด้วยประกันอัจฉริยะหลายภาษาที่เข้าใจการดูแลสัตว์เลี้ยงในเอเชียตะวันออกเฉียงใต้',
          singlish: 'Protect your furry family with smart, multilingual insurance that understands Southeast Asian pet care',
          ms: 'Lindungi keluarga berbulu anda dengan insurans pintar pelbagai bahasa yang memahami penjagaan haiwan peliharaan Asia Tenggara',
          id: 'Lindungi keluarga berbulu Anda dengan asuransi cerdas multibahasa yang memahami perawatan hewan peliharaan Asia Tenggara'
        }
      },
      {
        key: 'landing.get_coverage',
        translations: {
          en: 'Get Coverage',
          th: 'รับความคุ้มครอง',
          singlish: 'Get Coverage',
          ms: 'Dapatkan Perlindungan',
          id: 'Dapatkan Perlindungan'
        }
      },
      {
        key: 'landing.try_demo',
        translations: {
          en: 'Try Demo',
          th: 'ทดลองใช้',
          singlish: 'Try Demo',
          ms: 'Cuba Demo',
          id: 'Coba Demo'
        }
      },
      {
        key: 'landing.add_new_pet',
        translations: {
          en: 'Add New Pet & Get Coverage',
          th: 'เพิ่มสัตว์เลี้ยงใหม่และรับความคุ้มครอง',
          singlish: 'Add New Pet & Get Coverage',
          ms: 'Tambah Haiwan Baru & Dapatkan Perlindungan',
          id: 'Tambah Hewan Baru & Dapatkan Perlindungan'
        }
      },
      // Pet identity translations
      {
        key: 'pet_identity.title',
        translations: {
          en: 'Pet Identity Management',
          th: 'การจัดการข้อมูลสัตว์เลี้ยง',
          singlish: 'Pet Identity Management',
          ms: 'Pengurusan Identiti Haiwan',
          id: 'Manajemen Identitas Hewan'
        }
      },
      {
        key: 'pet_identity.subtitle',
        translations: {
          en: 'Manage your pets\' profiles, photos, and medical records',
          th: 'จัดการโปรไฟล์ รูปภาพ และบันทึกทางการแพทย์ของสัตว์เลี้ยงของคุณ',
          singlish: 'Manage your pets\' profiles, photos, and medical records lah',
          ms: 'Urus profil, foto, dan rekod perubatan haiwan peliharaan anda',
          id: 'Kelola profil, foto, dan catatan medis hewan peliharaan Anda'
        }
      },
      // Onboarding translations
      {
        key: 'onboarding.title',
        translations: {
          en: 'Welcome to PetInsureX',
          th: 'ยินดีต้อนรับสู่ PetInsureX',
          singlish: 'Welcome to PetInsureX lah',
          ms: 'Selamat datang ke PetInsureX',
          id: 'Selamat datang di PetInsureX'
        }
      },
      {
        key: 'onboarding.subtitle',
        translations: {
          en: 'Let\'s get your pet protected with AI-powered insurance',
          th: 'มาปกป้องสัตว์เลี้ยงของคุณด้วยประกันที่ขับเคลื่อนด้วย AI',
          singlish: 'Let\'s get your pet protected with AI-powered insurance lah',
          ms: 'Mari lindungi haiwan peliharaan anda dengan insurans dikuasakan AI',
          id: 'Mari lindungi hewan peliharaan Anda dengan asuransi bertenaga AI'
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
      {
        key: 'ai.actions.policy_recommend',
        translations: {
          en: 'Policy Recommendations',
          th: 'คำแนะนำกรมธรรม์',
          singlish: 'Policy Recommendations',
          ms: 'Cadangan Polisi',
          id: 'Rekomendasi Polis'
        }
      },
      {
        key: 'ai.actions.wellness_insights',
        translations: {
          en: 'Health Insights',
          th: 'ข้อมูลเชิงลึกสุขภาพ',
          singlish: 'Health Insights',
          ms: 'Wawasan Kesihatan',
          id: 'Wawasan Kesehatan'
        }
      },
      {
        key: 'ai.actions.claim_analysis',
        translations: {
          en: 'Analyze My Claims',
          th: 'วิเคราะห์การเคลมของฉัน',
          singlish: 'Analyze My Claims',
          ms: 'Analisis Tuntutan Saya',
          id: 'Analisis Klaim Saya'
        }
      },
      // AI Prompts
      {
        key: 'ai.prompts.coverage',
        translations: {
          en: 'What does my Premium Plus policy cover for Mali\'s emergency surgery?',
          th: 'กรมธรรม์ Premium Plus ของฉันครอบคลุมการผ่าตัดฉุกเฉินของมาลีอย่างไร?',
          singlish: 'What does my Premium Plus policy cover for Mali\'s emergency surgery lah?',
          ms: 'Apakah yang dilindungi oleh polisi Premium Plus saya untuk pembedahan kecemasan Mali?',
          id: 'Apa yang ditanggung polis Premium Plus saya untuk operasi darurat Mali?'
        }
      },
      {
        key: 'ai.prompts.claim_status',
        translations: {
          en: 'What is the status of my gastric torsion claim CLM-2024-08-19-001?',
          th: 'สถานะของการเคลม gastric torsion CLM-2024-08-19-001 ของฉันเป็นอย่างไร?',
          singlish: 'What\'s the status of my gastric torsion claim CLM-2024-08-19-001?',
          ms: 'Apakah status tuntutan gastric torsion saya CLM-2024-08-19-001?',
          id: 'Bagaimana status klaim gastric torsion saya CLM-2024-08-19-001?'
        }
      },
      {
        key: 'ai.prompts.emergency',
        translations: {
          en: 'My Golden Retriever is showing signs of bloating and distress - what should I do immediately?',
          th: 'โกลเด้นรีทรีฟเวอร์ของฉันมีอาการท้องอืดและเจ็บปวด - ฉันควรทำอย่างไรทันที?',
          singlish: 'My Golden Retriever got bloating and distress - what should I do now?',
          ms: 'Golden Retriever saya menunjukkan tanda-tanda kembung dan tertekan - apa yang perlu saya lakukan segera?',
          id: 'Golden Retriever saya menunjukkan tanda-tanda kembung dan tertekan - apa yang harus saya lakukan segera?'
        }
      },
      {
        key: 'ai.prompts.find_vet',
        translations: {
          en: 'Help me find 24/7 emergency veterinarians in Bangkok that accept my insurance',
          th: 'ช่วยหาสัตวแพทย์ฉุกเฉิน 24/7 ในกรุงเทพฯ ที่รับประกันของฉัน',
          singlish: 'Help me find 24/7 emergency vets in Bangkok that can take my insurance',
          ms: 'Tolong bantu saya mencari doktor haiwan kecemasan 24/7 di Bangkok yang menerima insurans saya',
          id: 'Bantu saya menemukan dokter hewan darurat 24/7 di Bangkok yang menerima asuransi saya'
        }
      },
      {
        key: 'ai.prompts.wellness',
        translations: {
          en: 'Schedule annual wellness checkup for Taro - he\'s due for vaccinations',
          th: 'นัดหมายตรวจสุขภาพประจำปีสำหรับทาโร่ - เขาถึงเวลาฉีดวัคซีนแล้ว',
          singlish: 'Schedule annual wellness checkup for Taro - he due for vaccinations already',
          ms: 'Jadualkan pemeriksaan kesihatan tahunan untuk Taro - dia perlu vaksinasi',
          id: 'Jadwalkan pemeriksaan kesehatan tahunan untuk Taro - dia perlu vaksinasi'
        }
      },
      {
        key: 'ai.prompts.analyze_bill',
        translations: {
          en: 'Please review this $1,250 emergency surgery invoice for accuracy and fraud detection',
          th: 'กรุณาตรวจสอบใบแจ้งหนี้การผ่าตัดฉุกเฉิน $1,250 เพื่อความถูกต้องและตรวจจับการฉ้อโกง',
          singlish: 'Please review this $1,250 emergency surgery invoice for accuracy and fraud detection',
          ms: 'Sila semak invois pembedahan kecemasan $1,250 ini untuk ketepatan dan pengesanan penipuan',
          id: 'Harap tinjau tagihan operasi darurat $1,250 ini untuk akurasi dan deteksi penipuan'
        }
      },
      {
        key: 'ai.powered_by',
        translations: {
          en: 'Powered by advanced AI for intelligent pet insurance support',
          th: 'ขับเคลื่อนด้วย AI ขั้นสูงเพื่อการสนับสนุนประกันสัตว์เลี้ยงอย่างชาญฉลาด',
          singlish: 'Powered by advanced AI for smart pet insurance support',
          ms: 'Dikuasakan oleh AI canggih untuk sokongan insurans haiwan yang pintar',
          id: 'Didukung oleh AI canggih untuk dukungan asuransi hewan yang cerdas'
        }
      },
      // Pet Identity Page
      {
        key: 'pet_identity.title',
        translations: {
          en: 'Pet Identity & AI Analysis',
          th: 'ระบุตัวตนสัตว์เลี้ยงและการวิเคราะห์ AI',
          singlish: 'Pet Identity & AI Analysis',
          ms: 'Identiti Haiwan & Analisis AI',
          id: 'Identitas Hewan & Analisis AI'
        }
      },
      {
        key: 'pet_identity.ai_features',
        translations: {
          en: 'AI-Powered Features',
          th: 'คุณสมบัติที่ขับเคลื่อนด้วย AI',
          singlish: 'AI-Powered Features',
          ms: 'Ciri-ciri Dikuasakan AI',
          id: 'Fitur Bertenaga AI'
        }
      },
      {
        key: 'pet_identity.breed_detection',
        translations: {
          en: 'Breed Detection',
          th: 'การตรวจจับสายพันธุ์',
          singlish: 'Breed Detection',
          ms: 'Pengesanan Baka',
          id: 'Deteksi Ras'
        }
      },
      {
        key: 'pet_identity.unique_id',
        translations: {
          en: 'Unique ID Mapping',
          th: 'การแมป ID ที่ไม่ซ้ำ',
          singlish: 'Unique ID Mapping',
          ms: 'Pemetaan ID Unik',
          id: 'Pemetaan ID Unik'
        }
      },
      {
        key: 'pet_identity.fraud_prevention',
        translations: {
          en: 'Fraud Prevention',
          th: 'การป้องกันการฉ้อโกง',
          singlish: 'Fraud Prevention',
          ms: 'Pencegahan Penipuan',
          id: 'Pencegahan Penipuan'
        }
      },
      {
        key: 'pet_identity.scan_title',
        translations: {
          en: 'AI Pet Identity Scan',
          th: 'การสแกนระบุตัวตนสัตว์เลี้ยงด้วย AI',
          singlish: 'AI Pet Identity Scan',
          ms: 'Imbasan Identiti Haiwan AI',
          id: 'Pemindaian Identitas Hewan AI'
        }
      },
      {
        key: 'pet_identity.choose_method',
        translations: {
          en: 'Choose Scan Method',
          th: 'เลือกวิธีการสแกน',
          singlish: 'Choose Scan Method',
          ms: 'Pilih Kaedah Imbasan',
          id: 'Pilih Metode Pemindaian'
        }
      },
      {
        key: 'pet_identity.method_description',
        translations: {
          en: 'Select how you\'d like to capture your pet\'s identity',
          th: 'เลือกวิธีที่คุณต้องการบันทึกข้อมูลสัตว์เลี้ยงของคุณ',
          singlish: 'Select how you want to capture your pet\'s identity',
          ms: 'Pilih cara anda ingin menangkap identiti haiwan anda',
          id: 'Pilih cara Anda ingin menangkap identitas hewan Anda'
        }
      },
      {
        key: 'pet_identity.photo_capture',
        translations: {
          en: 'Photo Capture',
          th: 'การถ่ายภาพ',
          singlish: 'Photo Capture',
          ms: 'Tangkapan Foto',
          id: 'Tangkapan Foto'
        }
      },
      {
        key: 'pet_identity.video_scan',
        translations: {
          en: 'Video Scan',
          th: 'การสแกนวิดีโอ',
          singlish: 'Video Scan',
          ms: 'Imbasan Video',
          id: 'Pemindaian Video'
        }
      },
      {
        key: 'pet_identity.unique_markers',
        translations: {
          en: 'Unique Markers',
          th: 'เครื่องหมายเฉพาะ',
          singlish: 'Unique Markers',
          ms: 'Penanda Unik',
          id: 'Penanda Unik'
        }
      },
      {
        key: 'pet_identity.recent_photos',
        translations: {
          en: 'Recent Photos',
          th: 'ภาพถ่ายล่าสุด',
          singlish: 'Recent Photos',
          ms: 'Foto Terkini',
          id: 'Foto Terbaru'
        }
      },
      {
        key: 'pet_identity.verified_pets',
        translations: {
          en: 'Verified Pets',
          th: 'สัตว์เลี้ยงที่ยืนยัน',
          singlish: 'Verified Pets',
          ms: 'Haiwan Disahkan',
          id: 'Hewan Terverifikasi'
        }
      },
      {
        key: 'pet_identity.avg_confidence',
        translations: {
          en: 'Avg Confidence',
          th: 'ความมั่นใจเฉลี่ย',
          singlish: 'Avg Confidence',
          ms: 'Purata Keyakinan',
          id: 'Rata-rata Kepercayaan'
        }
      },
      {
        key: 'pet_identity.unique_markers',
        translations: {
          en: 'Unique Markers',
          th: 'เครื่องหมายเฉพาะ',
          singlish: 'Unique Markers',
          ms: 'Penanda Unik',
          id: 'Penanda Unik'
        }
      },
      {
        key: 'pet_identity.last_scan',
        translations: {
          en: 'Last Scan',
          th: 'สแกนล่าสุด',
          singlish: 'Last Scan',
          ms: 'Imbasan Terakhir',
          id: 'Pindai Terakhir'
        }
      },
      {
        key: 'pet_identity.breed_detection_desc',
        translations: {
          en: 'Advanced AI identifies breed with 95%+ accuracy using computer vision',
          th: 'AI ขั้นสูงระบุสายพันธุ์ด้วยความแม่นยำ 95%+ โดยใช้คอมพิวเตอร์วิชัน',
          singlish: 'Advanced AI identifies breed with 95%+ accuracy using computer vision',
          ms: 'AI canggih mengenal pasti baka dengan ketepatan 95%+ menggunakan visi komputer',
          id: 'AI canggih mengidentifikasi ras dengan akurasi 95%+ menggunakan computer vision'
        }
      },
      {
        key: 'pet_identity.latest_sealion',
        translations: {
          en: 'Latest: SEA-LION.AI',
          th: 'ล่าสุด: SEA-LION.AI',
          singlish: 'Latest: SEA-LION.AI',
          ms: 'Terkini: SEA-LION.AI',
          id: 'Terbaru: SEA-LION.AI'
        }
      },
      {
        key: 'pet_identity.unique_id_desc',
        translations: {
          en: 'Creates digital fingerprint from facial features, markings, and patterns',
          th: 'สร้างลายนิ้วมือดิจิทัลจากใบหน้า เครื่องหมาย และลวดลาย',
          singlish: 'Creates digital fingerprint from facial features, markings, and patterns',
          ms: 'Mencipta cap jari digital daripada ciri muka, tanda, dan corak',
          id: 'Membuat sidik jari digital dari fitur wajah, tanda, dan pola'
        }
      },
      {
        key: 'pet_identity.features_markers',
        translations: {
          en: 'Features: 50+ markers',
          th: 'คุณสมบัติ: เครื่องหมาย 50+ จุด',
          singlish: 'Features: 50+ markers',
          ms: 'Ciri: 50+ penanda',
          id: 'Fitur: 50+ penanda'
        }
      },
      {
        key: 'pet_identity.fraud_prevention_desc',
        translations: {
          en: 'Prevents identity fraud by matching pets to verified database',
          th: 'ป้องกันการฉ้อโกงข้อมูลโดยจับคู่สัตว์เลี้ยงกับฐานข้อมูลที่ยืนยันแล้ว',
          singlish: 'Prevents identity fraud by matching pets to verified database',
          ms: 'Mencegah penipuan identiti dengan memadankan haiwan kepada pangkalan data yang disahkan',
          id: 'Mencegah penipuan identitas dengan mencocokkan hewan ke database yang terverifikasi'
        }
      },
      {
        key: 'pet_identity.accuracy_rate',
        translations: {
          en: 'Accuracy: 99.8%',
          th: 'ความแม่นยำ: 99.8%',
          singlish: 'Accuracy: 99.8%',
          ms: 'Ketepatan: 99.8%',
          id: 'Akurasi: 99.8%'
        }
      },
      {
        key: 'pet_identity.photo_capture_desc',
        translations: {
          en: 'Take photos from multiple angles',
          th: 'ถ่ายภาพจากหลายมุม',
          singlish: 'Take photos from multiple angles',
          ms: 'Ambil foto dari pelbagai sudut',
          id: 'Ambil foto dari berbagai sudut'
        }
      },
      {
        key: 'pet_identity.video_scan_desc',
        translations: {
          en: '360° video for complete analysis',
          th: 'วิดีโอ 360° สำหรับการวิเคราะห์แบบสมบูรณ์',
          singlish: '360° video for complete analysis',
          ms: 'Video 360° untuk analisis lengkap',
          id: 'Video 360° untuk analisis lengkap'
        }
      },
      {
        key: 'pet_identity.days_ago',
        translations: {
          en: '5 days',
          th: '5 วัน',
          singlish: '5 days',
          ms: '5 hari',
          id: '5 hari'
        }
      },
      {
        key: 'pet_identity.image_processing',
        translations: {
          en: 'Image Processing',
          th: 'การประมวลผลภาพ',
          singlish: 'Image Processing',
          ms: 'Pemprosesan Imej',
          id: 'Pemrosesan Gambar'
        }
      },
      {
        key: 'pet_identity.breed_analysis',
        translations: {
          en: 'Breed Analysis',
          th: 'การวิเคราะห์สายพันธุ์',
          singlish: 'Breed Analysis',
          ms: 'Analisis Baka',
          id: 'Analisis Ras'
        }
      },
      {
        key: 'pet_identity.feature_detection',
        translations: {
          en: 'Unique Feature Detection',
          th: 'การตรวจจับคุณลักษณะเฉพาะ',
          singlish: 'Unique Feature Detection',
          ms: 'Pengesanan Ciri Unik',
          id: 'Deteksi Fitur Unik'
        }
      },
      {
        key: 'pet_identity.database_comparison',
        translations: {
          en: 'Database Comparison',
          th: 'การเปรียบเทียบฐานข้อมูล',
          singlish: 'Database Comparison',
          ms: 'Perbandingan Pangkalan Data',
          id: 'Perbandingan Database'
        }
      },
      {
        key: 'pet_identity.health_assessment',
        translations: {
          en: 'Health Assessment',
          th: 'การประเมินสุขภาพ',
          singlish: 'Health Assessment',
          ms: 'Penilaian Kesihatan',
          id: 'Penilaian Kesehatan'
        }
      },
      {
        key: 'pet_identity.scan_complete',
        translations: {
          en: 'Scan Complete!',
          th: 'สแกนเสร็จสิ้น!',
          singlish: 'Scan Complete!',
          ms: 'Imbasan Selesai!',
          id: 'Pindai Selesai!'
        }
      },
      {
        key: 'pet_identity.scan_complete_desc',
        translations: {
          en: 'AI analysis has identified your pet with high confidence',
          th: 'การวิเคราะห์ AI ได้ระบุสัตว์เลี้ยงของคุณด้วยความมั่นใจสูง',
          singlish: 'AI analysis has identified your pet with high confidence',
          ms: 'Analisis AI telah mengenal pasti haiwan peliharaan anda dengan keyakinan tinggi',
          id: 'Analisis AI telah mengidentifikasi hewan peliharaan Anda dengan kepercayaan tinggi'
        }
      },
      {
        key: 'pet_identity.breed_detection_title',
        translations: {
          en: 'Breed Detection',
          th: 'การตรวจจับสายพันธุ์',
          singlish: 'Breed Detection',
          ms: 'Pengesanan Baka',
          id: 'Deteksi Ras'
        }
      },
      {
        key: 'pet_identity.uniqueness_score',
        translations: {
          en: 'Uniqueness Score',
          th: 'คะแนนความเป็นเอกลักษณ์',
          singlish: 'Uniqueness Score',
          ms: 'Skor Keunikan',
          id: 'Skor Keunikan'
        }
      },
      {
        key: 'pet_identity.highly_unique',
        translations: {
          en: 'Highly unique pet with distinctive features',
          th: 'สัตว์เลี้ยงที่มีเอกลักษณ์สูงพร้อมคุณลักษณะเฉพาะ',
          singlish: 'Highly unique pet with distinctive features',
          ms: 'Haiwan peliharaan yang sangat unik dengan ciri yang tersendiri',
          id: 'Hewan peliharaan yang sangat unik dengan fitur yang khas'
        }
      },
      {
        key: 'pet_identity.unique_markers_detected',
        translations: {
          en: 'Unique Markers Detected',
          th: 'ตรวจพบเครื่องหมายเฉพาะ',
          singlish: 'Unique Markers Detected',
          ms: 'Penanda Unik Dikesan',
          id: 'Penanda Unik Terdeteksi'
        }
      },
      {
        key: 'pet_identity.close_camera',
        translations: {
          en: 'Close Camera',
          th: 'ปิดกล้อง',
          singlish: 'Close Camera',
          ms: 'Tutup Kamera',
          id: 'Tutup Kamera'
        }
      },
      {
        key: 'pet_identity.close',
        translations: {
          en: 'Close',
          th: 'ปิด',
          singlish: 'Close',
          ms: 'Tutup',
          id: 'Tutup'
        }
      },
      {
        key: 'pet_identity.view_details',
        translations: {
          en: 'View Details',
          th: 'ดูรายละเอียด',
          singlish: 'View Details',
          ms: 'Lihat Butiran',
          id: 'Lihat Detail'
        }
      },
      {
        key: 'pet_identity.view_details_short',
        translations: {
          en: 'Details',
          th: 'รายละเอียด',
          singlish: 'Details',
          ms: 'Butiran',
          id: 'Detail'
        }
      },
      {
        key: 'pet_identity.new_scan',
        translations: {
          en: 'New Scan',
          th: 'สแกนใหม่',
          singlish: 'New Scan',
          ms: 'Imbasan Baru',
          id: 'Pindai Baru'
        }
      },
      {
        key: 'pet_identity.new_scan_short',
        translations: {
          en: 'Scan',
          th: 'สแกน',
          singlish: 'Scan',
          ms: 'Imbas',
          id: 'Pindai'
        }
      },
      {
        key: 'pet_identity.open_camera',
        translations: {
          en: 'Open Camera',
          th: 'เปิดกล้อง',
          singlish: 'Open Camera',
          ms: 'Buka Kamera',
          id: 'Buka Kamera'
        }
      },
      {
        key: 'pet_identity.upload_photos',
        translations: {
          en: 'Upload Photos',
          th: 'อัปโหลดรูปภาพ',
          singlish: 'Upload Photos',
          ms: 'Muat Naik Foto',
          id: 'Unggah Foto'
        }
      },
      {
        key: 'pet_identity.camera_active',
        translations: {
          en: 'Camera Active',
          th: 'กล้องทำงาน',
          singlish: 'Camera Active',
          ms: 'Kamera Aktif',
          id: 'Kamera Aktif'
        }
      },
      {
        key: 'pet_identity.starting_camera',
        translations: {
          en: 'Starting Camera...',
          th: 'กำลังเปิดกล้อง...',
          singlish: 'Starting Camera...',
          ms: 'Memulakan Kamera...',
          id: 'Memulai Kamera...'
        }
      },
      {
        key: 'pet_identity.capture_photo',
        translations: {
          en: 'Capture Photo',
          th: 'ถ่ายภาพ',
          singlish: 'Capture Photo',
          ms: 'Tangkap Foto',
          id: 'Ambil Foto'
        }
      },
      {
        key: 'pet_identity.capture_photo_short',
        translations: {
          en: 'Photo',
          th: 'ภาพ',
          singlish: 'Photo',
          ms: 'Foto',
          id: 'Foto'
        }
      },
      {
        key: 'pet_identity.stop_camera',
        translations: {
          en: 'Stop Camera',
          th: 'หยุดกล้อง',
          singlish: 'Stop Camera',
          ms: 'Hentikan Kamera',
          id: 'Hentikan Kamera'
        }
      },
      {
        key: 'pet_identity.stop_camera_short',
        translations: {
          en: 'Stop',
          th: 'หยุด',
          singlish: 'Stop',
          ms: 'Henti',
          id: 'Henti'
        }
      },
      {
        key: 'pet_identity.camera_support',
        translations: {
          en: 'Camera Support',
          th: 'รองรับกล้อง',
          singlish: 'Camera Support',
          ms: 'Sokongan Kamera',
          id: 'Dukungan Kamera'
        }
      },
      {
        key: 'pet_identity.available',
        translations: {
          en: 'Available',
          th: 'พร้อมใช้งาน',
          singlish: 'Available',
          ms: 'Tersedia',
          id: 'Tersedia'
        }
      },
      {
        key: 'pet_identity.not_available',
        translations: {
          en: 'Not Available',
          th: 'ไม่พร้อมใช้งาน',
          singlish: 'Not Available',
          ms: 'Tidak Tersedia',
          id: 'Tidak Tersedia'
        }
      },
      {
        key: 'pet_identity.supported',
        translations: {
          en: 'Supported',
          th: 'รองรับ',
          singlish: 'Supported',
          ms: 'Disokong',
          id: 'Didukung'
        }
      },
      {
        key: 'pet_identity.not_supported',
        translations: {
          en: 'Not Supported',
          th: 'ไม่รองรับ',
          singlish: 'Not Supported',
          ms: 'Tidak Disokong',
          id: 'Tidak Didukung'
        }
      },
      {
        key: 'pet_identity.https_localhost',
        translations: {
          en: 'HTTPS/Localhost',
          th: 'HTTPS/Localhost',
          singlish: 'HTTPS/Localhost',
          ms: 'HTTPS/Localhost',
          id: 'HTTPS/Localhost'
        }
      },
      {
        key: 'pet_identity.secure',
        translations: {
          en: 'Secure',
          th: 'ปลอดภัย',
          singlish: 'Secure',
          ms: 'Selamat',
          id: 'Aman'
        }
      },
      {
        key: 'pet_identity.requires_https',
        translations: {
          en: 'Requires HTTPS',
          th: 'ต้องใช้ HTTPS',
          singlish: 'Requires HTTPS',
          ms: 'Memerlukan HTTPS',
          id: 'Memerlukan HTTPS'
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
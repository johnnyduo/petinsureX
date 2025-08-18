
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { GlassCard } from '@/components/ui/glass-card';
import { PawButton } from '@/components/ui/paw-button';
import { Modal } from '@/components/ui/modal';
import { FileUploader } from '@/components/ui/file-uploader';
import { cn } from '@/lib/utils';
import { 
  Stethoscope, 
  FileText, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Upload,
  Signature,
  Key,
  Hash,
  Eye,
  Download,
  Plus,
  User,
  Calendar,
  MapPin
} from 'lucide-react';

const VetPortal = () => {
  const [showAttestationModal, setShowAttestationModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const mockInvoices = [
    {
      id: 'inv-001',
      patientName: 'Mali',
      ownerName: 'Jun Nakamura',
      date: '2024-01-15',
      amount: 430,
      treatment: 'Hip dysplasia surgery',
      status: 'pending_attestation',
      items: [
        { description: 'Pre-operative examination', amount: 60, category: 'consultation' },
        { description: 'Orthopedic surgery', amount: 285, category: 'surgery' },
        { description: 'Anesthesia', amount: 45, category: 'medication' },
        { description: 'Post-operative care', amount: 40, category: 'treatment' }
      ],
      hash: null,
      signature: null
    },
    {
      id: 'inv-002',
      patientName: 'Taro',
      ownerName: 'Jun Nakamura',
      date: '2024-01-10',
      amount: 100,
      treatment: 'Annual vaccination package',
      status: 'attested',
      items: [
        { description: 'Health examination', amount: 45, category: 'consultation' },
        { description: 'Vaccination set', amount: 55, category: 'medication' }
      ],
      hash: '0x7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730',
      signature: '0x8b331f0a...',
      attestedAt: '2024-01-10T11:30:00Z'
    }
  ];

  const mockStats = [
    { label: 'Invoices Today', value: '12', icon: FileText, color: 'text-blue-600' },
    { label: 'Pending Attestation', value: '3', icon: Clock, color: 'text-yellow-600' },
    { label: 'Attested This Month', value: '89', icon: CheckCircle, color: 'text-green-600' },
    { label: 'Total Revenue', value: '$7,000', icon: Shield, color: 'text-petinsure-teal-600' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_attestation': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'attested': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const generateAttestation = (invoice: any) => {
    // Simulate KMS signature generation
    const hash = `0x${Math.random().toString(16).substring(2, 66)}`;
    const signature = `0x${Math.random().toString(16).substring(2, 18)}...`;
    
    return {
      ...invoice,
      hash,
      signature,
      status: 'attested',
      attestedAt: new Date().toISOString()
    };
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Stethoscope size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-bold text-gray-900">Veterinary Portal</h1>
                  <p className="text-gray-600">Dr. Sarah Chen - Sunny Pet Clinic</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      Bangkok, Thailand
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield size={14} />
                      License: VET-TH-2019-001234
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <PawButton variant="secondary" onClick={() => setShowInvoiceModal(true)}>
                  <Upload size={20} />
                  Upload Invoice
                </PawButton>
                <PawButton onClick={() => setShowAttestationModal(true)}>
                  <Signature size={20} />
                  Bulk Attest
                </PawButton>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {mockStats.map((stat, index) => (
              <GlassCard key={index} className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={cn("p-3 rounded-xl bg-white/50", stat.color)}>
                    <stat.icon size={24} />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Invoice Management */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-gray-900">Invoice Management</h2>
              <div className="flex items-center gap-3">
                <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-petinsure-teal-300 focus:ring-2 focus:ring-petinsure-teal-100">
                  <option>All Invoices</option>
                  <option>Pending Attestation</option>
                  <option>Attested</option>
                  <option>Rejected</option>
                </select>
                <PawButton size="sm" onClick={() => setShowInvoiceModal(true)}>
                  <Plus size={16} />
                  New Invoice
                </PawButton>
              </div>
            </div>

            <div className="space-y-4">
              {mockInvoices.map((invoice) => (
                <div key={invoice.id} className="p-6 rounded-xl bg-white/30 border border-white/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 text-xl">#{invoice.id.split('-')[1].toUpperCase()}</h3>
                          <span className={cn("px-3 py-1 rounded-full text-xs font-medium border", getStatusColor(invoice.status))}>
                            {invoice.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><strong>Patient:</strong> {invoice.patientName}</p>
                          <p><strong>Owner:</strong> {invoice.ownerName}</p>
                          <p><strong>Treatment:</strong> {invoice.treatment}</p>
                          <p><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">${invoice.amount.toLocaleString()}</p>
                      {invoice.hash && (
                        <div className="mt-2 space-y-1 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Hash size={12} />
                            <span className="font-mono">{invoice.hash.substring(0, 20)}...</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Key size={12} />
                            <span className="font-mono">{invoice.signature}...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Treatment Items</h4>
                      <div className="space-y-1 text-sm">
                        {invoice.items.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-gray-600">{item.description}</span>
                            <span className="font-medium">${item.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Attestation Status</h4>
                      {invoice.status === 'attested' ? (
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle size={16} />
                            <span>Digitally Signed</span>
                          </div>
                          <div className="text-gray-600">
                            Attested: {new Date(invoice.attestedAt!).toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-yellow-600">
                            <Clock size={16} />
                            <span>Pending Digital Signature</span>
                          </div>
                          <PawButton size="sm" onClick={() => {
                            const updated = generateAttestation(invoice);
                            // In real app, this would update the state
                            alert(`Invoice ${invoice.id} has been attested with hash: ${updated.hash}`);
                          }}>
                            <Signature size={14} />
                            Attest Now
                          </PawButton>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-white/20">
                    <PawButton variant="ghost" size="sm">
                      <Eye size={16} />
                      View Details
                    </PawButton>
                    <PawButton variant="secondary" size="sm">
                      <Download size={16} />
                      Download PDF
                    </PawButton>
                    {invoice.status === 'pending_attestation' && (
                      <PawButton size="sm">
                        <Signature size={16} />
                        Digital Signature
                      </PawButton>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Upload Invoice Modal - Mobile optimized */}
      <Modal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        title="Upload New Invoice"
        size="md"
      >
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Patient Name</label>
              <input
                type="text"
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-petinsure-teal-300 focus:ring-2 focus:ring-petinsure-teal-100 text-gray-900 placeholder-gray-500 bg-white"
                placeholder="Pet's name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Owner Name</label>
              <input
                type="text"
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-petinsure-teal-300 focus:ring-2 focus:ring-petinsure-teal-100 text-gray-900 placeholder-gray-500 bg-white"
                placeholder="Owner's name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Treatment Description</label>
            <textarea
              rows={3}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-petinsure-teal-300 focus:ring-2 focus:ring-petinsure-teal-100 text-gray-900 placeholder-gray-500 bg-white resize-none"
              placeholder="Describe the treatment provided..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Treatment Date</label>
              <input
                type="date"
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-petinsure-teal-300 focus:ring-2 focus:ring-petinsure-teal-100 text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Total Amount</label>
              <input
                type="number"
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-petinsure-teal-300 focus:ring-2 focus:ring-petinsure-teal-100 text-gray-900 placeholder-gray-500 bg-white"
                placeholder="Amount in THB"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Invoice Document</label>
            <FileUploader
              onFilesChange={setUploadedFiles}
              accept=".pdf,.doc,.docx,image/*"
              multiple={false}
              maxFiles={1}
              title="Upload Invoice"
              description="PDF, DOC, or image format"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t border-gray-200">
            <PawButton variant="ghost" className="flex-1 order-2 sm:order-1" onClick={() => setShowInvoiceModal(false)}>
              Cancel
            </PawButton>
            <PawButton className="flex-1 order-1 sm:order-2">
              Upload & Generate Hash
            </PawButton>
          </div>
        </div>
      </Modal>

      {/* Bulk Attestation Modal - Mobile optimized */}
      <Modal
        isOpen={showAttestationModal}
        onClose={() => setShowAttestationModal(false)}
        title="Bulk Digital Attestation"
        size="md"
      >
        <div className="space-y-4 sm:space-y-6">
          <div className="p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">Digital Signature Process</h4>
            <p className="text-xs sm:text-sm text-blue-800">
              This will create cryptographic hashes for all pending invoices and sign them with your KMS private key.
              Each signature provides legal attestation of the invoice authenticity.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Pending Invoices (3)</h4>
            {mockInvoices.filter(inv => inv.status === 'pending_attestation').map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-white/20">
                <div>
                  <p className="font-medium text-gray-900">#{invoice.id.split('-')[1].toUpperCase()}</p>
                  <p className="text-sm text-gray-600">{invoice.patientName} - ${invoice.amount.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-yellow-500" />
                  <span className="text-sm text-yellow-600">Pending</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 sm:p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Key size={14} className="text-green-600 sm:w-4 sm:h-4" />
              <span className="font-medium text-green-900 text-sm sm:text-base">KMS Security</span>
            </div>
            <p className="text-xs sm:text-sm text-green-800">
              Your private key is securely stored in AWS KMS and will be used to generate tamper-proof digital signatures.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t border-gray-200">
            <PawButton variant="ghost" className="flex-1 order-2 sm:order-1" onClick={() => setShowAttestationModal(false)}>
              Cancel
            </PawButton>
            <PawButton className="flex-1 order-1 sm:order-2">
              <Signature size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Sign All Invoices</span>
              <span className="sm:hidden">Sign All</span>
            </PawButton>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default VetPortal;

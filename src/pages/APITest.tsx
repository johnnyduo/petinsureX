import React from 'react';
import { Layout } from '@/components/layout/Layout';
import APITestComponent from '@/components/APITestComponent';

/**
 * API Test Page for Vercel Deployment
 * Access this page to verify API functionality after deployment
 * Remove this page before final production release
 */
const APITestPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🧪 SEA-LION API Test Suite
            </h1>
            <p className="text-lg text-gray-600">
              Verify API functionality for Vercel deployment
            </p>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Development Tool:</strong> This page is for testing purposes only. 
                Remove before final production deployment.
              </p>
            </div>
          </div>

          <APITestComponent />
          
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">🚀 Quick Vercel Deployment Checklist</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4" />
                <label className="text-sm">Environment variables set in Vercel dashboard</label>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4" />
                <label className="text-sm">API key is valid and active</label>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4" />
                <label className="text-sm">Domain configured for production</label>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4" />
                <label className="text-sm">All API tests passing</label>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4" />
                <label className="text-sm">Remove test components before launch</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default APITestPage;
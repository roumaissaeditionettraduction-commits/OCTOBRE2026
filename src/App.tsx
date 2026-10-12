/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { SecurityGuard } from './components/SecurityGuard';
import { Navbar } from './components/Navbar';
import { Storefront } from './components/Storefront';
import { AdminDashboard } from './components/AdminDashboard';
import { SecureEbookReader } from './components/SecureEbookReader';
import { MyLibraryView } from './components/MyLibraryView';
import { ArticlesView } from './components/ArticlesView';
import { ForumView } from './components/ForumView';
import { SubmitManuscriptView } from './components/SubmitManuscriptView';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { currentView } = useStore();

  if (currentView === 'reader') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col">
        <SecurityGuard />
        <SecureEbookReader />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 font-sans selection:bg-amber-100 selection:text-amber-900">
      <SecurityGuard />
      <Navbar />

      <main className="flex-1">
        {currentView === 'store' && <Storefront />}
        {currentView === 'dashboard' && <AdminDashboard />}
        {currentView === 'library' && <MyLibraryView />}
        {currentView === 'articles' && <ArticlesView />}
        {currentView === 'forum' && <ForumView />}
        {currentView === 'submit_manuscript' && <SubmitManuscriptView />}
      </main>

      {currentView !== 'dashboard' && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
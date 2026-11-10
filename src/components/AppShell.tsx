'use client';

import React from 'react';
import { useMarbleStore } from '@/lib/store';
import RoleSwitcher from '@/components/RoleSwitcher';
import DemoFrame from '@/components/DemoFrame';
import Toast from '@/components/Toast';
import JobRecord from '@/components/screens/JobRecord';
import Troubleshooter from '@/components/screens/Troubleshooter';
import SalesIntake from '@/components/screens/SalesIntake';
import CrewChecklist from '@/components/screens/CrewChecklist';
import PMEscalations from '@/components/screens/PMEscalations';
import OwnerKnowledge from '@/components/screens/OwnerKnowledge';
import AskGuide from '@/components/screens/AskGuide';

export default function AppShell() {
  const { state } = useMarbleStore();
  const { activeTab, activeRole } = state;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950">
      <RoleSwitcher />
      <DemoFrame>
        {activeTab === 'record' && <JobRecord />}
        {activeTab === 'troubleshoot' && <Troubleshooter />}
        {activeTab === 'role-action' && (
          <>
            {activeRole === 'sales' && <SalesIntake />}
            {activeRole === 'craftsman' && <CrewChecklist />}
            {activeRole === 'pm' && <PMEscalations />}
            {activeRole === 'owner' && <OwnerKnowledge />}
          </>
        )}
        {activeTab === 'ask' && <AskGuide />}
      </DemoFrame>
      <Toast />
    </div>
  );
}

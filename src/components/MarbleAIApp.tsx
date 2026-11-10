'use client';

import React from 'react';
import { MarbleStoreProvider } from '@/lib/store';
import AppShell from '@/components/AppShell';

export default function MarbleAIApp() {
  return (
    <MarbleStoreProvider>
      <AppShell />
    </MarbleStoreProvider>
  );
}

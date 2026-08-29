'use client';

import React, { Suspense } from 'react';
import AppointmentBooking from '@/components/AppointmentBooking';

export default function AgendarCitaPage() {
  return (
    <div className="py-10">
      <Suspense fallback={<div className="text-center py-12 text-sm text-slate-500">Cargando agendamiento...</div>}>
        <AppointmentBooking />
      </Suspense>
    </div>
  );
}

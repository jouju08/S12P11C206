import React from 'react';
import BaseTale from '@/components/BaseTale/BaseTale';
import AdminAuthForm from '@/components/BaseTale/AdminAuthForm';
import { adminStore } from '@/store/adminStore';
export default function Admin() {
  const authKey = adminStore().authKey;
  if (!authKey) {
    return (
      <div>
        <AdminAuthForm />
      </div>
    );
  } else {
    return (
      <div>
        <BaseTale />
      </div>
    );
  }
}

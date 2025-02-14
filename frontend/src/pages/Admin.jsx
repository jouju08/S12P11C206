import React from 'react';
import AdminMenu from '@/components/Admin/AdminMenu';
import AdminAuthForm from '@/components/Admin/AdminAuthForm';
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
        <AdminMenu />
      </div>
    );
  }
}

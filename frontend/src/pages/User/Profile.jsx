import React from 'react';
import ParentNav from '@/components/Parent/ParentNav';
import Edit from '@/components/Parent/Edit';

export default function Profile() {
  return <div className='flex'>
    <ParentNav
    nickname="닉네임"
    loginId="아이디" />
    <Edit/>
    </div>;
}

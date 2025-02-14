import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { api, userStore } from '@/store/userStore';
import { adminStore } from '@/store/adminStore';
import LoadingText from './LoadingText';

const AdminAuthForm = () => {
  const { authKey, setAuthKey } = adminStore();

  const initialFormData = {
    text: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  useEffect(() => {
    return () => {
      setFormData(initialFormData);
    };
  }, []);

  const submitAuthKey = async (e) => {
    e.preventDefault();
    const res = await api.post('/admin/tale/auth', formData);
    console.log('fdsak;fljdsakfljasdk;fljdsakf;fsfksafjkafjklsadf');
    console.log(res.data.data);
    if (res.status === 200 && res.data && res.data.data == true) {
      setAuthKey(formData.text);
    } else {
      Swal.fire('인증 실패', '비밀번호를 확인해주세요', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div>
      <div className="text-2xl font-bold text-center">관리자 페이지</div>
      <form onSubmit={submitAuthKey}>
        <input
          type="new-password"
          name="text"
          value={formData.text}
          placeholder="비밀번호를 입력해주세요"
          className="border border-gray-300 rounded-md p-2 w-full"
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
};

export default AdminAuthForm;

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { api, userStore } from '@/store/userStore';
import { adminStore } from '@/store/adminStore';
import LoadingText from '../BaseTale/LoadingText';

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
    <div className="w-[60vw] h-[60vh] mt-[10vh] bg-white text-3xl font-bold text-center rounded-md">
      <div className="text-5xl font-bold text-center pt-[20vh] pb-[5vh]">
        관리자 페이지
      </div>
      <form onSubmit={submitAuthKey}>
        <div className="flex-row">
          <div>
            <input
              type="password"
              name="text"
              value={formData.text}
              placeholder="비밀번호를 입력해주세요"
              className="border border-gray-300 rounded-md p-2 text-center"
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-900 text-white w-1/2 p-2 mt-5 rounded-md">
            확인
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAuthForm;

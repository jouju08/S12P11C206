import { uploadFile } from '@/apis/tale/FileAPI';
import React, { useState } from 'react';
import authAPI from '@/apis/auth/userAxios';
import { useUser } from '@/store/userStore';

export default function FileTest() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const { guide } = authAPI;

  const { refreshAccessToken } = useUser();

  // 파일 선택 핸들러
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // 파일 업로드 요청
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('파일을 선택하세요.');
      return;
    }

    try {
      const response = await uploadFile(selectedFile);
      alert(response);
    } catch (error) {
      alert('파일 업로드 실패');
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
      />
      <button onClick={handleUpload}>업로드</button>

      <div>
        <button
          className="bg-red-300"
          onClick={guide}>
          Guide
        </button>
      </div>

      <div>
        <button
          className="bg-red-300"
          onClick={refreshAccessToken}>
          Refresh
        </button>
      </div>
    </div>
  );
}

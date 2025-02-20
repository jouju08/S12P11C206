import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { api, userStore } from '@/store/userStore';
import { adminStore } from '@/store/adminStore';
import LoadingText from '../BaseTale/LoadingText';

const BaseTale = () => {
  const initialFormData = {
    title: '',
    titleImg: '',
    startVoice: '',
    startImg: '',
    startScript: '',
    keyword1: '',
    keyword2: '',
    keyword3: '',
    keyword4: '',
    keywordSentence1: '',
    keywordSentence2: '',
    keywordSentence3: '',
    keywordSentence4: '',
  };

  const [baseTales, setBaseTales] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [selectedId, setSelectedId] = useState(null);
  const [formDataReadyState, setFormDataReadyState] = useState({
    title: -1,
    titleImg: -1,
    startImg: -1,
    startVoice: -1,
  });

  const {
    connect,
    selectedTitleImage,
    titleImages,
    selectedIntroImage,
    introImages,
    authKey,
  } = adminStore();
  const {
    setTitleImages,
    setSelectedTitleImage,
    setIntroImages,
    setSelectedIntroImage,
  } = adminStore();

  useEffect(() => {
    fetchBaseTales();
    handleNewTale();
    connect(); // 웹소켓 구독 (실제 사용하는 웹소켓 client에 맞게 수정)
  }, []);

  // titleImages 변경 시 titleImg ready 상태 업데이트
  useEffect(() => {
    setFormDataReadyState((prev) => ({
      ...prev,
      titleImg: titleImages != null ? 1 : -1,
    }));
  }, [titleImages]);

  // introImages 변경 시 startImg ready 상태 업데이트
  useEffect(() => {
    setFormDataReadyState((prev) => ({
      ...prev,
      startImg: introImages != null ? 1 : -1,
    }));
  }, [introImages]);

  // BaseTale 목록 조회
  const fetchBaseTales = async () => {
    try {
      const response = await api.get(`/admin/tale/base-tale`, {
        headers: {
          authKey: authKey,
        },
      });
      let taleList = response.data?.data;
      if (!Array.isArray(taleList)) {
        taleList = taleList ? [taleList] : [];
      }
      setBaseTales(taleList);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: '동화 목록을 불러오지 못했습니다.',
      });
    }
  };

  // 폼 input 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 새로운 동화 생성
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.keywordSentence1.includes('xx') ||
      !formData.keywordSentence2.includes('xx') ||
      !formData.keywordSentence3.includes('xx') ||
      !formData.keywordSentence4.includes('xx')
    ) {
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: '키워드 문장에는 "xx"가 포함되어야 합니다.',
      });
      return;
    }
    try {
      const response = await api.post('/admin/tale/base-tale', formData, {
        headers: {
          authKey: authKey,
        },
      });
      if (response.data && response.data.data) {
        Swal.fire({
          icon: 'success',
          title: '성공',
          text: '동화가 성공적으로 요청되었습니다!',
        });
        fetchBaseTales(); // 목록 새로 조회
      }
      handleNewTale();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '저장 실패',
        text: '동화 요청에 실패했습니다.',
      });
    }
  };

  // "제목으로 동화 생성하기" 버튼 핸들러
  const handleGenerateTaleByTitle = async () => {
    if (!formData.title) {
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: '제목을 입력해주세요.',
      });
      return;
    }
    try {
      setFormDataReadyState((prev) => ({ ...prev, title: 0 }));
      const response = await api.get(
        `/admin/tale/tale-sentences/${encodeURIComponent(formData.title)}`
      );
      if (response.data && response.data.data) {
        const taleSentences = response.data.data;
        const sentences = taleSentences.sentences || [];
        setFormData((prev) => ({
          ...prev,
          startScript: taleSentences.introduction ?? '',
          keywordSentence1: sentences[0] ?? '',
          keywordSentence2: sentences[1] ?? '',
          keywordSentence3: sentences[2] ?? '',
          keywordSentence4: sentences[3] ?? '',
        }));
        setFormDataReadyState((prev) => ({ ...prev, title: 1 }));
        Swal.fire({
          icon: 'success',
          title: '성공',
          text: '제목 기반 동화 생성에 성공했습니다.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '생성 실패',
        text: '제목 기반 동화 생성에 실패했습니다.',
      });
    }
  };

  // 도입부 스크립트를 기반으로 음성 URL 생성하기
  const handleGenerateVoiceUrl = async () => {
    if (!formData.startScript) {
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: '도입부 스크립트를 입력하거나 생성해주세요.',
      });
      return;
    }
    try {
      setFormDataReadyState((prev) => ({ ...prev, startVoice: 0 }));
      const response = await api.post('/admin/tale/tale-script-read', {
        text: formData.startScript,
      });
      if (response.data && response.data.data) {
        setFormData((prev) => ({
          ...prev,
          startVoice: response.data.data,
        }));
        setFormDataReadyState((prev) => ({ ...prev, startVoice: 1 }));
        Swal.fire({
          icon: 'success',
          title: '성공',
          text: '도입부 음성 생성에 성공했습니다.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '생성 실패',
        text: '도입부 음성 생성에 실패했습니다.',
      });
    }
  };

  ////////////////////////////////////// 타이틀 이미지 생성 ////////////////////////////////////////
  const handleGenerateTitleImage = async () => {
    if (!formData.title) {
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: '제목을 입력해주세요.',
      });
      return;
    }
    try {
      setFormDataReadyState((prev) => ({ ...prev, titleImg: 0 }));
      await api.post('/admin/tale/gen-title-image', {
        memberId: userStore.getState().memberId,
        title: formData.title,
      });
      Swal.fire({
        icon: 'success',
        title: '요청 완료',
        text: '타이틀 이미지 생성 요청을 보냈습니다.',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '생성 실패',
        text: '타이틀 이미지 생성 요청에 실패했습니다.',
      });
    }
  };

  const handleSelectTitleImage = async (url) => {
    setSelectedTitleImage(url);
  };

  const submitSelectedTitleImage = async () => {
    if (!selectedTitleImage) {
      return;
    }

    const url = selectedTitleImage;
    try {
      const response = await api.post('/admin/tale/set-image', { text: url });

      if (response.data && response.data.data.text) {
        setFormData((prev) => ({
          ...prev,
          titleImg: response.data.data.text,
        }));
        setSelectedTitleImage(response.data.data.text);
        Swal.fire({
          icon: 'success',
          title: '확정 완료',
          text: '이미지 확정에 성공했습니다.',
        });
      }
      return;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '확정 실패',
        text: '이미지 확정에 실패했습니다.',
      });
      return;
    }
  };

  ////////////////////////////////////// 인트로 이미지 생성 ////////////////////////////////////////
  const handleGenerateIntroImage = async () => {
    if (!formData.title || !formData.startScript) {
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: '제목과 도입부 스크립트를 모두 입력해주세요.',
      });
      return;
    }
    try {
      setFormDataReadyState((prev) => ({ ...prev, startImg: 0 }));
      await api.post('/admin/tale/gen-intro-image', {
        memberId: userStore.getState().memberId,
        title: formData.title,
        intro: formData.startScript,
      });
      Swal.fire({
        icon: 'success',
        title: '요청 완료',
        text: '도입부 이미지 생성 요청을 보냈습니다.',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '생성 실패',
        text: '도입부 이미지 생성 요청에 실패했습니다.',
      });
    }
  };

  const handleSelectIntroImage = async (url) => {
    setSelectedIntroImage(url);
  };

  const submitSelectedIntroImage = async () => {
    if (!selectedIntroImage) {
      return;
    }

    const url = selectedIntroImage;
    try {
      const response = await api.post('/admin/tale/set-image', { text: url });

      if (response.data && response.data.data.text) {
        setFormData((prev) => ({
          ...prev,
          startImg: response.data.data.text,
        }));
        setSelectedIntroImage(response.data.data.text);
        Swal.fire({
          icon: 'success',
          title: '확정 완료',
          text: '이미지 확정에 성공했습니다.',
        });
      }
      return;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '확정 실패',
        text: '이미지 확정에 실패했습니다.',
      });
      return;
    }
  };

  // 목록에서 동화 선택 시 상세 조회 후 form에 채우기
  const handleSelectTale = async (id) => {
    try {
      const response = await api.get(`/admin/tale/base-tale/${id}`, {
        headers: {
          authKey: authKey,
        },
      });
      handleNewTale();
      if (response.data && response.data.data) {
        const data = response.data.data;
        const safeData = {
          id: data.id ?? '',
          title: data.title ?? '',
          titleImg: data.titleImg ?? '',
          startVoice: data.startVoice ?? '',
          startImg: data.startImg ?? '',
          startScript: data.startScript ?? '',
          keyword1: data.keyword1 ?? '',
          keyword2: data.keyword2 ?? '',
          keyword3: data.keyword3 ?? '',
          keyword4: data.keyword4 ?? '',
          keywordSentence1: data.keywordSentence1 ?? '',
          keywordSentence2: data.keywordSentence2 ?? '',
          keywordSentence3: data.keywordSentence3 ?? '',
          keywordSentence4: data.keywordSentence4 ?? '',
        };
        setFormData(safeData);
        setSelectedId(id);
        if (data.startImg) {
          setSelectedIntroImage(data.startImg);
        }
        if (data.titleImg) {
          setSelectedTitleImage(data.titleImg);
        }
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '조회 실패',
        text: '동화 상세 정보를 불러오지 못했습니다.',
      });
    }
  };

  // 새 동화 등록을 위한 form 초기화
  const handleNewTale = () => {
    setFormData(initialFormData);
    setFormDataReadyState({
      title: -1,
      titleImg: -1,
      startImg: -1,
      startVoice: -1,
    });
    setSelectedTitleImage(null);
    setSelectedIntroImage(null);
    setTitleImages(null);
    setIntroImages(null);
    setSelectedId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 mt-5 shadow-lg rounded-lg max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        기본 동화 관리
      </h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 왼쪽: 동화 목록 */}
        <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            동화 목록
          </h2>
          {baseTales.length === 0 ? (
            <p className="text-gray-600">등록된 동화가 없습니다.</p>
          ) : (
            <ul className="space-y-2">
              {baseTales.map((tale) => (
                <li
                  key={tale.id}
                  onClick={() => handleSelectTale(tale.id)}
                  className="cursor-pointer text-indigo-600 hover:bg-indigo-50 p-3 rounded-lg transition">
                  {tale.title} (ID: {tale.id})
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={handleNewTale}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md shadow transition duration-300">
            새 동화 생성
          </button>
        </div>

        {/* 오른쪽: 동화 등록/수정 form */}
        <div className="lg:w-2/3 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            {selectedId ? '동화 상세 조회' : '새 동화 등록'}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="space-y-2">
            {/* 제목 입력 및 생성 */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <label className="w-32 font-medium text-gray-700">제목 :</label>
              <div className="flex-1 relative">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleGenerateTaleByTitle}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow transition duration-300">
              제목으로 동화 생성하기{' '}
              <LoadingText loading={formDataReadyState.title} />
            </button>
            {/* 타이틀 이미지 섹션 */}
            <div className="flex flex-col gap-3">
              <div className="w-full font-medium text-gray-700">
                표지 이미지{' '}
                {!selectedTitleImage && (
                  <div className="font-medium text-gray-300">
                    (동화의 제목으로 표지를 생성합니다.)
                  </div>
                )}
              </div>
              <div className="flex-1">
                {selectedTitleImage && (
                  <div className="flex flex-col justify-center items-center gap-3 mb-2">
                    <img
                      src={selectedTitleImage}
                      alt="Selected Title"
                      className="w-24 h-auto rounded shadow-md"
                    />
                    <button
                      type="button"
                      onClick={submitSelectedTitleImage}
                      className="text-white bg-green-600 hover:bg-green-700 text-white w-24 h-auto rounded-md">
                      확정하기
                    </button>
                  </div>
                )}
                {!selectedTitleImage && (
                  <div className="font-medium text-gray-700">
                    이미지가 아직 없습니다.
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {titleImages && (
                  <div>
                    {!selectedTitleImage && (
                      <p className="mb-2 font-medium text-gray-700">
                        아래 이미지 중 원하는 이미지를 선택해주세요:
                      </p>
                    )}
                    <div className="flex gap-4">
                      {titleImages.map((url, index) => (
                        <div
                          key={index}
                          onClick={() => handleSelectTitleImage(url)}
                          className="cursor-pointer border border-gray-200 p-2 rounded-lg hover:shadow-xl transition">
                          <img
                            src={url}
                            alt={`Option ${index + 1}`}
                            className="w-24 h-auto rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleGenerateTitleImage}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow transition duration-300">
                  타이틀 이미지 {selectedTitleImage && <span>다시 </span>}
                  생성하기 <LoadingText loading={formDataReadyState.titleImg} />
                </button>
              </div>
            </div>

            {/* 도입부 스크립트 */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                도입부 스크립트:
              </label>
              <textarea
                name="startScript"
                value={formData.startScript}
                onChange={handleInputChange}
                rows="3"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            {/* 도입부 이미지 섹션 */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <label className="w-full font-medium text-gray-700">
                도입부 이미지
                {!selectedTitleImage && (
                  <div className="font-medium text-gray-300">
                    {' '}
                    (동화의 제목과 도입부로 표지를 생성합니다.)
                  </div>
                )}
              </label>
            </div>
            <div className="flex-1">
              {selectedIntroImage && (
                <div className="flex flex-col justify-center items-center gap-3 mb-2">
                  <img
                    src={selectedIntroImage}
                    alt="Selected Intro"
                    className="w-24 h-auto rounded shadow-md"
                  />
                  <button
                    type="button"
                    onClick={submitSelectedIntroImage}
                    className="text-white bg-green-600 hover:bg-green-700 text-white w-24 h-auto rounded-md">
                    확정하기
                  </button>
                </div>
              )}
              {!selectedIntroImage && (
                <div className="font-medium text-gray-700">
                  이미지가 아직 없습니다.
                </div>
              )}
            </div>
            {introImages && (
              <div>
                <p className="mb-2 font-medium text-gray-700">
                  아래 이미지 중 원하는 이미지를 선택해주세요:
                </p>
                <div className="flex gap-4">
                  {introImages.map((url, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectIntroImage(url)}
                      className="cursor-pointer border border-gray-200 p-2 rounded-lg hover:shadow-xl transition">
                      <img
                        src={url}
                        alt={`Option ${index + 1}`}
                        className="w-24 h-auto rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={handleGenerateIntroImage}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow transition duration-300">
              도입부 {introImages && <span>다시 </span>}이미지 생성하기
              <LoadingText loading={formDataReadyState.startImg} />
            </button>
            {/* 도입부 음성 URL 및 생성 */}
            <div className="flex-col gap-3">
              <label className="w-32 font-medium text-gray-700">
                도입부 음성
              </label>
              <div className="flex-2">
                {!formData.startVoice && (
                  <div className="text-gray-300">
                    도입부 음성이 아직 생성되지 않았습니다.
                  </div>
                )}
                {formData.startVoice && (
                  <audio
                    controls
                    src={formData.startVoice}
                    className="mt-2 w-full"
                  />
                )}

                <button
                  type="button"
                  onClick={handleGenerateVoiceUrl}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow transition duration-300">
                  도입부 음성 생성하기{' '}
                  <LoadingText loading={formDataReadyState.startVoice} />
                </button>
              </div>
            </div>

            {/* 키워드 및 키워드 문장 입력 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  키워드1:
                </label>
                <input
                  type="text"
                  name="keyword1"
                  value={formData.keyword1}
                  onChange={handleInputChange}
                  placeholder="예: 모험"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  키워드 문장1:
                </label>
                <input
                  type="text"
                  name="keywordSentence1"
                  value={formData.keywordSentence1}
                  onChange={handleInputChange}
                  placeholder="문장에 'xx' 포함"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  키워드2:
                </label>
                <input
                  type="text"
                  name="keyword2"
                  value={formData.keyword2}
                  onChange={handleInputChange}
                  placeholder="예: 마법"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  키워드 문장2:
                </label>
                <input
                  type="text"
                  name="keywordSentence2"
                  value={formData.keywordSentence2}
                  onChange={handleInputChange}
                  placeholder="문장에 'xx' 포함"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  키워드3:
                </label>
                <input
                  type="text"
                  name="keyword3"
                  value={formData.keyword3}
                  onChange={handleInputChange}
                  placeholder="예: 용기"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  키워드 문장3:
                </label>
                <input
                  type="text"
                  name="keywordSentence3"
                  value={formData.keywordSentence3}
                  onChange={handleInputChange}
                  placeholder="문장에 'xx' 포함"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  키워드4:
                </label>
                <input
                  type="text"
                  name="keyword4"
                  value={formData.keyword4}
                  onChange={handleInputChange}
                  placeholder="예: 우정"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  키워드 문장4:
                </label>
                <input
                  type="text"
                  name="keywordSentence4"
                  value={formData.keywordSentence4}
                  onChange={handleInputChange}
                  placeholder="문장에 'xx' 포함"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-md shadow-lg transition-all duration-300">
              {selectedId ? '수정사항 저장' : '저장'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BaseTale;

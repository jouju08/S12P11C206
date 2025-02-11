import React, { useState, useEffect } from 'react';
import { api } from '@/store/userStore';
import { adminStore } from '@/store/adminStore';
import LoadingText  from './LoadingText';

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
    keywordSentence4: ''
  };

    const [baseTales, setBaseTales] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [selectedId, setSelectedId] = useState(null);
  const [formDataReadyState, setFormDataReadyState] = useState({
    title:-1,
    titleImg: -1,
    startImg: -1,
    startVoice: -1
  });

  const { connect, selectedTitleImage, titleImages, selectedIntroImage, introImages } = adminStore();
  const { setTitleImages, setSelectedTitleImage, setIntroImages, setSelectedIntroImage,  } = adminStore();


  useEffect(() => {
    fetchBaseTales();
    connect() // 웹소켓 구독 (실제 사용하는 웹소켓 client에 맞게 수정)
  }, []);

   // titleImages가 변경될 때마다 titleImg의 ready 상태 업데이트
   useEffect(() => {
    setFormDataReadyState(prev => ({
      ...prev,
      // titleImages가 null이 아니면 true, null이면 false (필요에 따라 추가 조건도 사용 가능)
      titleImg: titleImages != null ? 1 : -1,
    }));
  }, [titleImages]);

  // introImages가 변경될 때마다 startImg의 ready 상태 업데이트
  useEffect(() => {
    setFormDataReadyState(prev => ({
      ...prev,
      // introImages가 null이 아니면 true, null이면 false
      startImg: introImages != null ? 1 : -1,
    }));
  }, [introImages]);

  // BaseTale 목록 조회 함수
  const fetchBaseTales = async () => {
    try {
      const response = await api.get('/admin/tale/base-tale');
      let taleList = response.data?.data;
      if (!Array.isArray(taleList)) {
        taleList = taleList ? [taleList] : [];
      }
      setBaseTales(taleList);
    } catch (error) {
      console.error('BaseTale 목록 조회 실패:', error);
    }
  };

  // form input 값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 새로운 동화 생성
  const handleSubmit = async (e) => {
    // 만약, keywordSentence1~4 중 하나라도 xx라는 글자가 값에 들어 있지 않다면 alert
    if (!formData.keywordSentence1.includes('xx') || !formData.keywordSentence2.includes('xx') || !formData.keywordSentence3.includes('xx') || !formData.keywordSentence4.includes('xx')) {
      alert('키워드 문장에는 "xx"가 포함되어야 합니다.');
      return;
    }

    e.preventDefault();
    try {
      const response = await api.post('/admin/tale/base-tale', formData);
      if (response.data && response.data.data) {
        console.log('생성된 BaseTale id:', response.data.data);
        fetchBaseTales(); // 목록 새로 조회
      }
      handleNewTale();
    } catch (error) {
      console.error('BaseTale 저장 실패:', error);
    }
  };


  // "제목으로 동화 생성하기" 버튼 핸들러
  const handleGenerateTaleByTitle = async () => {
    if (!formData.title) {
      alert('제목을 입력해주세요.');
      return;
    }
    try {
      setFormDataReadyState((prev) => ({ ...prev, title: 0 }));
      // 제목에 특수문자가 있을 수 있으므로 encodeURIComponent 사용
      const response = await api.get(
        `/admin/tale/tale-sentences/${encodeURIComponent(formData.title)}`
      );
      if (response.data && response.data.data) {
        const taleSentences = response.data.data;
        const sentences = taleSentences.sentences || [];
        // 도입부는 startScript, 그리고 sentences 배열을 각각 keywordSentence1~4에 매핑
        setFormData((prev) => ({
          ...prev,
          startScript: taleSentences.introduction ?? '',
          keywordSentence1: sentences[0] ?? '',
          keywordSentence2: sentences[1] ?? '',
          keywordSentence3: sentences[2] ?? '',
          keywordSentence4: sentences[3] ?? ''
        }));
        setFormDataReadyState((prev) => ({ ...prev, title: 1 }));
      }
    } catch (error) {
      console.error('동화 생성 실패:', error);
    }
  };

  // 도입부 스크립트를 기반으로 음성 URL 생성하기 버튼 핸들러
  const handleGenerateVoiceUrl = async () => {
    if (!formData.startScript) {
      alert('도입부 스크립트를 입력하거나 생성해주세요.');
      return;
    }
    try {
      setFormDataReadyState((prev) => ({ ...prev, startVoice: 0 }));
      // 요청 본문: { text: 도입부 스크립트 }
      const response = await api.post('/admin/tale/tale-script-read', { text: formData.startScript });
      if (response.data && response.data.data) {
        // 응답으로 받은 URL을 도입부 음성 URL 필드(startVoice)에 채움
        setFormData((prev) => ({
          ...prev,
          startVoice: response.data.data
        }));
        setFormDataReadyState((prev) => ({ ...prev, startVoice: 1 }));
      }
    } catch (error) {
      console.error('도입부 음성 URL 생성 실패:', error);
    }
  };
  //////////////////////////////////////타이틀 이미지 생성////////////////////////////////////////
  // 타이틀 이미지 생성하기 버튼 핸들러
  const handleGenerateTitleImage = async () => {
    if (!formData.title) {
      alert('제목을 입력해주세요.');
      return;
    }
    try {
      // 요청 본문은 { title }로 구성
      setFormDataReadyState((prev) => ({ ...prev, titleImg: 0 }));
      await api.post('/admin/tale/gen-title-image', {
        text: formData.title
      });
    } catch (error) {
      console.error('타이틀 이미지 생성 요청 실패:', error);
    }
  }
  // 타이틀 이미지 선택시 임시 미리보기
  const handleSelectTitleImage = async (url) => {
    setSelectedTitleImage(url);
  }

  //타이틀 이미지 선택시 서버에 저장
  const handleSubmitSelectedTitleImage = async () => {
    if (!selectedTitleImage) {
      alert('이미지를 선택해주세요.');
      return;
    }
    const url = selectedTitleImage
    try {
      const response = await api.post('/admin/tale/set-image', {
        text: url
      });
      console.log(response);
      if (response.data && response.data.data.text) {
        setFormData((prev) => ({
          ...prev,
          titleImg: response.data.data.text
        }));
        setSelectedTitleImage(response.data.data.text);
      }
    } catch (error) {
      console.error('타이틀 이미지 선택 실패:', error);
    }
  }

  //////////////////////////////////////인트로 이미지 생성///////////////////////////////////////
  // 인트로 이미지 생성하기 버튼 핸들러
  const handleGenerateIntroImage = async () => {
    if (!formData.title || !formData.startScript) {
      alert('제목과 도입부 스크립트를 모두 입력해주세요.');
      return;
    }
    try {
      setFormDataReadyState((prev) => ({ ...prev, startImg: 0 }));
      // 요청 본문은 { title, intro }로 구성 (intro는 도입부 스크립트)
      await api.post('/admin/tale/gen-intro-image', {
        title: formData.title,
        intro: formData.startScript
      });

    } catch (error) {
      console.error('도입부 이미지 생성 요청 실패:', error);
    }
  };
  // 인트로 이미지 선택시 임시 미리보기
  const handleSelectIntroImage = async (url) => {
    setSelectedIntroImage(url);
  }

  //인트로 이미지 선택시 서버에 저장
  const handleSubmitSelectedIntroImage = async () => {
    if (!selectedIntroImage) {
      alert('이미지를 선택해주세요.');
      return;
    }
    const url = selectedIntroImage;
    try {
      const response = await api.post('/admin/tale/set-image', {
        text: url
      });
      console.log(response);
      if(response.data && response.data.data.text){
        setFormData((prev) => ({
          ...prev,
          startImg: response.data.data.text
        }));
        setSelectedIntroImage(response.data.data.text);
      }
      handleNewTale();
    } catch (error) {
      console.error('도입부 이미지 선택 실패:', error);
    }
  }

  // 목록에서 동화 선택 시 상세정보 조회 후 form에 채우기
  const handleSelectTale = async (id) => {
    try {
      const response = await api.get(`/admin/tale/base-tale/${id}`);
      handleNewTale();
      if (response.data && response.data.data) {
        const data = response.data.data;
        // null 값을 빈 문자열로 치환
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
        if(data.startImg){
          setSelectedIntroImage(data.startImg);
        }
        if (data.titleImg) {
          setSelectedTitleImage(data.titleImg);
        }
      }
    } catch (error) {
      console.error('BaseTale 상세 조회 실패:', error);
    }
  };

  // 새 동화 등록을 위한 form 초기화
  const handleNewTale = () => {
    setFormData(initialFormData);
    setFormDataReadyState({
      title: -1,
      titleImg: -1,
      startImg: -1,
      startVoice: -1
    })
    setSelectedTitleImage(null);
    setSelectedIntroImage(null);
    setTitleImages(null);
    setIntroImages(null);
    setSelectedId(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Base Tale 관리</h1>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {/* 왼쪽: 목록 */}
        <div style={{ flex: 1, marginRight: '20px' }}>
          <h2>동화 목록</h2>
          {baseTales.length === 0 ? (
            <p>등록된 동화가 없습니다.</p>
          ) : (
            <ul>
              {baseTales.map((tale) => (
                <li
                  key={tale.id}
                  onClick={() => handleSelectTale(tale.id)}
                  style={{ cursor: 'pointer', marginBottom: '8px' }}
                >
                  {tale.title} (ID: {tale.id})
                </li>
              ))}
            </ul>
          )}
          <button onClick={handleNewTale}>새 동화 등록</button>
        </div>

        {/* 오른쪽: form */}
        <div style={{ flex: 2 }}>
          <h2>{selectedId ? '동화 상세 조회' : '새 동화 등록'}</h2>
          <form onSubmit={handleSubmit}>
            {/* 제목 입력란 및 제목으로 동화 생성하기 버튼 */}
            <div style={{ marginBottom: '10px' }}>
              <label style={{ width: '150px', display: 'inline-block' }}>
                제목:
              </label>
              <LoadingText loading={formDataReadyState.title} />
              <input
                type="text"
                name="title"
                value={formData.title ?? ''}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                onClick={handleGenerateTaleByTitle}
                style={{ marginLeft: '10px' }}
              >
                제목으로 동화 생성하기
              </button>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ width: '150px', display: 'inline-block' }}>타이틀 이미지 URL:</label>
              {selectedTitleImage != null && (
                <>
                  <img src={selectedTitleImage} alt="Selected Title Image" style={{ width: '100px', height: 'auto' }} />
                  <button type="button" onClick={() => handleSubmitSelectedTitleImage()}> 
                    선택한 이미지 등록하기
                  </button>
                </>
              )}
              <LoadingText loading={formDataReadyState.titleImg} />
              <input
                type="text"
                name="titleImg"
                value={formData.titleImg ?? ''}
                onChange={handleInputChange}
                readOnly
              />
              <button
                type="button"
                onClick={handleGenerateTitleImage}
                style={{ marginLeft: '10px' }}
              >
                타이틀 이미지 생성하기
              </button>
            </div>
            {/* 도입부 이미지 옵션 표시 (웹소켓으로 전달받은 4개의 이미지 URL) */}
            {titleImages != null && (
              <div style={{ marginBottom: '10px' }}>
                <p>아래 이미지 중 원하는 이미지를 선택해주세요:</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {titleImages.map((url, index) => (
                    <div
                      key={index}
                      style={{ cursor: 'pointer', border: '1px solid #ccc', padding: '5px' }}
                      onClick={() => handleSelectTitleImage(url)}
                    >
                      <img src={url} alt={`Option ${index + 1}`} style={{ width: '100px', height: 'auto' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* 도입부 이미지 URL 및 생성 버튼 */}
            <div style={{ marginBottom: '10px' }}>
              <label style={{ width: '150px', display: 'inline-block' }}>
                도입부 이미지 URL:
              </label>
              {selectedIntroImage != null && (
                <>
                  <img src={selectedIntroImage} alt="Selected Intro Image" style={{ width: '100px', height: 'auto' }} />
                  <button type="button" onClick={() => handleSubmitSelectedIntroImage()}> 
                    선택한 이미지 등록하기
                  </button>
                </>
              )}
              <LoadingText loading={formDataReadyState.startImg} />
              <input
                type="text"
                name="startImg"
                value={formData.startImg ?? ''}
                onChange={handleInputChange}
                readOnly
              />
              <button
                type="button"
                onClick={handleGenerateIntroImage}
                style={{ marginLeft: '10px' }}
              >
                도입부 이미지 생성하기
              </button>
            </div>

            {/* 도입부 이미지 옵션 표시 (웹소켓으로 전달받은 4개의 이미지 URL) */}
            {introImages != null && (
              <div style={{ marginBottom: '10px' }}>
                <p>아래 이미지 중 원하는 이미지를 선택해주세요:</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {introImages.map((url, index) => (
                    <div
                      key={index}
                      style={{ cursor: 'pointer', border: '1px solid #ccc', padding: '5px' }}
                      onClick={() => handleSelectIntroImage(url)}
                    >
                      <img src={url} alt={`Option ${index + 1}`} style={{ width: '100px', height: 'auto' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 도입부 스크립트 입력란 */}
            <div style={{ marginBottom: '10px' }}>
              <label style={{ width: '150px', display: 'inline-block' }}>도입부 스크립트:</label>
              <textarea
                name="startScript"
                value={formData.startScript ?? ''}
                onChange={handleInputChange}
                rows="3"
                style={{ verticalAlign: 'top' }}
                required
              />
            </div>
            {/* 도입부 음성 URL 필드와 도입부 음성 생성하기 버튼 */}
            <div style={{ marginBottom: '10px' }}>
              <label style={{ width: '150px', display: 'inline-block' }}>
                도입부 음성 URL:
              </label>
              <LoadingText loading={formDataReadyState.startVoice} />
              <input
                type="text"
                name="startVoice"
                value={formData.startVoice ?? ''}
                onChange={handleInputChange}
                readOnly
              />

              {formData.startVoice && (
                <audio controls src={formData.startVoice} />
              )}
              
              <button
                type="button"
                onClick={handleGenerateVoiceUrl}
                style={{ marginLeft: '10px' }}
              >
                도입부 음성 생성하기
              </button>
            </div>
            {/* Keyword 및 KeywordSentence 입력란 */}
            <div style={{ marginBottom: '10px' }}>
              <label style={{ width: '150px', display: 'inline-block' }}>키워드1:</label>
              <input
                title="키워드 문장 'xx'에 대체될 기본 단어를 입력해주세요."
                type="text"
                name="keyword1"
                value={formData.keyword1 ?? ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ width: '150px', display: 'inline-block' }}>키워드 문장1:</label>
              <input
                title="키워드 문장에는 'xx'가 포함되어야 합니다."
                type="text"
                name="keywordSentence1"
                value={formData.keywordSentence1 ?? ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ width: '150px', display: 'inline-block' }}>키워드2:</label>
              <input
                title="키워드 문장 'xx'에 대체될 기본 단어를 입력해주세요."
                type="text"
                name="keyword2"
                value={formData.keyword2 ?? ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ width: '150px', display: 'inline-block' }}>키워드 문장2:</label>
              <input
                title="키워드 문장에는 'xx'가 포함되어야 합니다."
                type="text"
                name="keywordSentence2"
                value={formData.keywordSentence2 ?? ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ width: '150px', display: 'inline-block' }}>키워드3:</label>
              <input
                title="키워드 문장 'xx'에 대체될 기본 단어를 입력해주세요."
                type="text"
                name="keyword3"
                value={formData.keyword3 ?? ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ width: '150px', display: 'inline-block' }}>키워드 문장3:</label>
              <input
                title="키워드 문장에는 'xx'가 포함되어야 합니다."
                type="text"
                name="keywordSentence3"
                value={formData.keywordSentence3 ?? ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ width: '150px', display: 'inline-block' }}>키워드4:</label>
              <input
                title="키워드 문장 'xx'에 대체될 기본 단어를 입력해주세요."
                type="text"
                name="keyword4"
                value={formData.keyword4 ?? ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ width: '150px', display: 'inline-block' }}>키워드 문장4:</label>
              <input
                title="키워드 문장에는 'xx'가 포함되어야 합니다."
                type="text"
                name="keywordSentence4"
                value={formData.keywordSentence4 ?? ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit">
              {selectedId ? '등록' : '저장(새로운 동화로 등록)'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BaseTale;

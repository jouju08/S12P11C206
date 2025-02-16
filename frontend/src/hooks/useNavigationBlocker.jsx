import { useTaleRoom } from '@/store/roomStore';
import { useTalePlay } from '@/store/tale/playStore';
import { useViduHook } from '@/store/tale/viduStore';
import { userStore } from '@/store/userStore';
import { restore } from '@excalidraw/excalidraw';
import { useStartVideo } from '@livekit/components-react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * @description 동화 이탈 방지 커스텀 훅
 * @param {Object} routeMapping - 특정 경로에 따른 이동 대상 및 WebSocket 매핑
 * @returns {Object} 모달 표시 여부, 이동 허용 함수, 이동 취소 함수
 */

export const useNavigationBlocker = (routeMapping) => {
  const [showEscape, setShowEscape] = useState(false); // 모달
  const [nextPath, setNextPath] = useState(null); //이동경로
  const navigate = useNavigate();
  const location = useLocation();

  const { stompClient, leaveRoom, setIsEscape } = useTaleRoom();
  const { roomId, resetState } = useTalePlay();
  const { leaveViduRoom } = useViduHook();

  useEffect(() => {
    /**
     * @description 창 닫기 또는 새로고침
     */

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    /**
     * @description 뒤로 가기 시
     */

    const handlePopState = (e) => {
      e.preventDefault();
      if (!showEscape) {
        setShowEscape(true);
        window.history.pushState(null, '', location.pathname); // 뒤로 가기 막기
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname, showEscape]);

  useEffect(() => {
    /**
     * @description  네비게이션 감지
     */
    const handleNavigation = () => {
      setShowEscape(true);
      setNextPath(location.pathname);
    };

    return () => {
      setShowModal(false);
    };
  }, [location.pathname]);

  /**
   * @description 이동 허용
   */
  const handleConfirmExit = async () => {
    const currentPath = location.pathname;
    const { redirect, wsUrl } = routeMapping[currentPath] || {
      redirect: '/room',
      wsUrl: null,
    };

    try {
      if (wsUrl !== null) {
        if (stompClient && stompClient.connected) {
          stompClient.publish({
            destination: wsUrl, //keyword Before After
            body: JSON.stringify({ escape: 'bye' }),
          });
        }
      }
    } catch (error) {
      console.error('사스케 실패:', error);
    } finally {
      leaveRoom();
      leaveViduRoom();
      resetState();

      setIsEscape(true);

      setShowEscape(false);

      navigate(redirect || nextPath, { replace: true });
    }
  };

  /**
   * @description 이동 취소
   */
  const handleCancelExit = () => {
    setShowEscape(false);
  };

  return { showEscape, handleConfirmExit, handleCancelExit };
};

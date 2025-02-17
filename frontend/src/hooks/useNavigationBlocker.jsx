import { useTaleRoom } from '@/store/roomStore';
import { useTalePlay } from '@/store/tale/playStore';
import { useViduHook } from '@/store/tale/viduStore';
import { userStore } from '@/store/userStore';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * @description 동화 이탈 방지
 * - 새로고침/창 닫기 시: beforeunload 이벤트
 * - 뒤로가기/앞으로가기 시: popstate 이벤트, window.confirm()을 이용해
 *   확인 시 WebSocket 메시지 전송 및 상태 정리, 아니면 페이지 유지.
 */
export const useNavigationBlocker = () => {
  const [nextPath, setNextPath] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { stompClient, currentRoom, leaveRoom, setIsEscape } = useTaleRoom();
  const { resetState } = useTalePlay();
  const { leaveViduRoom } = useViduHook();

  const routeMapping = useMemo(
    () => ({
      '/tale/taleStart': {
        redirect: '/room',
        wsUrl: currentRoom
          ? `/app/room/escape/before/${currentRoom.roomId}`
          : null,
      },
      '/tale/taleKeyword': {
        redirect: '/room',
        wsUrl: currentRoom
          ? `/app/room/escape/before/${currentRoom.roomId}`
          : null,
      },
      '/tale/taleSentenceDrawing': {
        redirect: '/room',
        wsUrl: currentRoom
          ? `/app/room/escape/after/${currentRoom.roomId}/${userStore.getState().memberId}`
          : null,
      },
    }),
    [currentRoom]
  );

  const handleEscape = (location) => {
    if (routeMapping[location.pathname]) {
      const { redirect, wsUrl } = routeMapping[location.pathname];
      const data = JSON.stringify({ escape: 'bye' });

      if (wsUrl && stompClient && stompClient.connected) {
        stompClient.publish({
          destination: wsUrl,
          body: data,
        });
      }

      return 'escape';
    }
  };

  // 새로고침이나 창 닫기 시
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (routeMapping[location.pathname]) {
        const { redirect, wsUrl } = routeMapping[location.pathname];
        const data = JSON.stringify({ escape: 'bye' });

        if (wsUrl && stompClient && stompClient.connected) {
          stompClient.publish({
            destination: wsUrl,
            body: data,
          });
        }

        e.preventDefault();
        e.returnValue = '정말 방을 나갈껀가요?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname, routeMapping]);

  //  뒤로가기/앞으로가기 시 처리: window.confirm()을 사용해 사용자 확인
  useEffect(() => {
    const handlePopState = (e) => {
      if (routeMapping[location.pathname]) {
        const answer = window.confirm('정말 방을 나갈껀가요?');
        if (answer) {
          // 확인 시 WebSocket 메시지 전송 및 상태 정리
          const { redirect, wsUrl } = routeMapping[location.pathname] || {
            redirect: '/room',
            wsUrl: null,
          };
          try {
            if (wsUrl && stompClient && stompClient.connected) {
              console.log('WebSocket 연결: 메시지 전송', wsUrl);
              stompClient.publish({
                destination: wsUrl,
                body: JSON.stringify({ escape: 'bye' }),
              });
            }
          } catch (error) {
            console.error('WebSocket 메시지 전송 실패:', error);
          } finally {
            leaveRoom();
            leaveViduRoom();
            resetState();
            setIsEscape(true);
            navigate(redirect || nextPath, { replace: true });
          }
        } else {
          navigate(location.pathname, { replace: true });
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname, routeMapping, stompClient, nextPath]);

  // 페이지 내 경로 변화 감지
  useEffect(() => {
    setNextPath(location.pathname);
  }, [location.pathname]);

  return { handleEscape };
};

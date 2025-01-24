import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useTaleRoom } from '@/store/roomStore';

const BASE_WS_URL = 'http://192.168.100.136:8080/ws';

let stompClient = null;

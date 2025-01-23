const [stompClient, setStompClient] = useState(null);
const [rooms, setRooms] = useState([]);

useEffect(() => {
  const socket = new SockJS('http://192.168.100.136:8080/ws');
  const client = new Client({
    webSocketFactory: () => socket,
    onConnect: () => {
      console.log('Connected');
      client.subscribe('/topic/rooms', (message) => {
        console.log(message.body);
        console.log(JSON.parse(message.body));
        setRooms((prev) => [...prev, JSON.parse(message.body)]);
      });
    },
    onDisconnect: () => console.log('Disconnected'),
    debug: (str) => console.log(str),
  });

  client.activate();
  setStompClient(client);

  return () => client.deactivate();
}, []);

const createRoom = () => {
  stompClient.publish({
    destination: '/app/room/create',
    body: JSON.stringify({ creatorId: 12 }),
  });
};

const joinRoom = (roomId, username) => {
  stompClient.publish({
    destination: `/app/room/join`,
    body: JSON.stringify({ roomId, username }),
  });
};

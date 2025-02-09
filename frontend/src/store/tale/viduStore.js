import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { api } from '../userStore';
import {
  LocalVideoTrack,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
} from 'livekit-client';

//state
const viduRoom = undefined;
const localTrack = undefined;
const remoteTracks = [];
const viduToken = '';

const openVidu = undefined;

// const LIVE_KIT_URL = 'ws://localhost:7880';
const LIVE_KIT_URL = import.meta.env.VITE_OPENVIDU_URL;

const viduActions = (set, get) => ({
  getTokenByAxios: async (roomId) => {
    console.log(roomId);
    const response = await api.get('/tale/room/token', {
      params: {
        roomId: roomId,
      },
    });

    if (response) {
      set({ viduToken: response.data['data'] });
    }
    return response;
  },

  joinViduRoom: async () => {
    get().setNewRoom();

    const room = useViduStore.getState().viduRoom;

    if (room) {
      // Specify the actions when events take place in the room
      // On every new Track received...
      room.on(RoomEvent.TrackSubscribed, (_track, publication, participant) => {
        set((state) => ({
          remoteTracks: [
            ...state.remoteTracks,
            {
              trackPublication: publication,
              participantIdentity: participant.identity,
            },
          ],
        }));
      });

      // On every Track destroyed...
      room.on(RoomEvent.TrackUnsubscribed, (_track, publication) => {
        set((state) => ({
          remoteTracks: state.remoteTracks.filter(
            (track) => track.trackPublication.trackSid !== publication.trackSid
          ),
        }));
      });

      try {
        await room.connect(LIVE_KIT_URL, useViduStore.getState().viduToken);
        await room.localParticipant.setCameraEnabled(true);

        set((state) => {
          state.localTrack = room.localParticipant.videoTrackPublications
            .values()
            .next().value.videoTrack;
        });
      } catch (error) {
        console.log(
          'There was an error connecting to the room:',
          error.message
        );
        await get().leaveViduRoom();
      }
    }
  },

  leaveViduRoom: async () => {
    const room = useViduStore.getState().viduRoom;
    await room?.disconnect();

    set({
      viduRoom: undefined,
      localTrack: undefined,
      remoteTracks: [],
    });
  },

  setNewRoom: () => {
    set((state) => {
      state.viduRoom = new Room();
    });
  },
});

const useViduStore = create(
  devtools(
    immer((set, get) => ({
      viduToken,
      viduRoom,
      localTrack,
      remoteTracks,
      ...viduActions(set, get),
    }))
  )
);

export const useViduHook = () => {
  const viduRoom = useViduStore((state) => state.viduRoom);
  const localTrack = useViduStore((state) => state.localTrack);
  const remoteTracks = useViduStore((state) => state.remoteTracks);

  const joinViduRoom = useViduStore((state) => state.joinViduRoom);
  const leaveViduRoom = useViduStore((state) => state.leaveViduRoom);
  const getTokenByAxios = useViduStore((state) => state.getTokenByAxios);

  return {
    viduRoom,
    localTrack,
    remoteTracks,

    joinViduRoom,
    leaveViduRoom,
    getTokenByAxios,
  };
};

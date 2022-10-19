import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const login = createAsyncThunk(
  'rooms/login',
  async function ({ roomId, userName }, { rejectWithValue }) {
    console.log(roomId, userName);
    try {
      const body = { roomId, userName };
      const response = await axios.post('http://localhost:8080/rooms', body);

      if (response.status !== 200) {
        throw new Error('Server error');
      }

      return { joined: true, ...body };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const joinRoom = createAsyncThunk(
  'rooms/join',
  async function ({ roomId }, { rejectWithValue }) {
    console.log(roomId);
    try {
      const body = { roomId };
      const response = await axios.get(`http://localhost:8080/rooms/${roomId}`);
      console.log(response);

      if (response.status !== 200) {
        throw new Error('Server error');
      }

      return response.data;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

const setError = (state, action) => {
  state.status = 'rejected';
};

const appSlice = createSlice({
  name: 'rooms',
  initialState: {
    joined: false,
    roomId: null,
    userName: null,
    users: [],
    messages: [],
    status: null,
  },
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
  },
  extraReducers: {
    [login.pending]: (state, action) => {
      state.status = 'loading';
      state.joined = false;
    },
    [login.fulfilled]: (state, action) => {
      console.log(action);
      state.status = 'resolved';
      state.joined = action.payload.joined;
      state.userName = action.payload.userName;
      state.roomId = action.payload.roomId;
    },
    [login.rejected]: setError,
    [joinRoom.pending]: (state, action) => {
      // state.users = action.payload.users;
      // state.messages = action.payload.messages;
    },
    [joinRoom.fulfilled]: (state, action) => {
      state.users = action.payload.users;
      state.messages = action.payload.messages;
    },
    [joinRoom.rejected]: (state, action) => {
      console.log('rej', action);
    },
  },
});

export const { setUsers, addMessage } = appSlice.actions;

export default appSlice.reducer;

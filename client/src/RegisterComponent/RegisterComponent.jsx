import React from 'react';
import { Button, Input, DatePicker, message } from 'antd/lib';
// import socket from '../socket';
import styles from './styles.scss';
import axios from 'axios';
import { login } from '../store/slice';
import { useDispatch, useSelector } from 'react-redux';

export const RegisterComponent = () => {
  const [roomId, setRoomId] = React.useState('');
  const [name, setName] = React.useState('');
  const dispatch = useDispatch();
  const status = useSelector((state) => state.rooms.status);

  const enterRoom = () => {
    if (!roomId || !name) {
      return message.error('Не верные данные для входа');
    }
    dispatch(login({ roomId, userName: name }));
  };

  return (
    <div className={styles.wrapper}>
      <Input
        placeholder={'ID комнаты'}
        size="large"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <Input
        placeholder={'Ваше имя'}
        size="large"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={enterRoom} size="large" type="primary">
        {status === 'loading' ? 'Вход...' : 'Войти'}
      </Button>
    </div>
  );
};

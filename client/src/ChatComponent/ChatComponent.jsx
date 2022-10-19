import React from 'react';
import { Button, Layout } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { Content } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import { useDispatch, useSelector } from 'react-redux';
import socket from '../socket';
import { setUsers, joinRoom, addMessage } from '../store/slice';
import styles from './styles.scss';

const ChatComponent = () => {
  const { userName, roomId, users, messages } = useSelector((state) => state.rooms);
  const dispatch = useDispatch();
  const [messageText, setMessageText] = React.useState('');
  const messagesRef = React.useRef(null);
  React.useEffect(() => {
    dispatch(joinRoom({ roomId }));
  }, []);

  React.useEffect(() => {
    socket.emit('ROOM:JOIN', {
      userName,
      roomId,
    });
    messagesRef.current.scrollTo(0, 99999);
    socket.on('ROOM:SET_USERS', (users) => {
      dispatch(setUsers(users));
    });
    socket.on('ROOM:NEW_MESSAGE', (message) => {
      dispatch(addMessage(message));
    });
  }, []);

  React.useEffect(() => {
    messagesRef.current.scrollTo(0, 99999);
  }, [messages]);

  const onHandleSendMessage = () => {
    if (messageText.split('') !== '') {
      socket.emit('ROOM:NEW_MESSAGE', {
        roomId,
        userName,
        text: messageText,
      });
      dispatch(addMessage({ userName, text: messageText }));
      setMessageText('');
    }
  };

  return (
    <div>
      <Layout>
        <Sider className={styles.slider}>
          <h3>Комната {roomId}</h3>
          <div>Пользователи({users.length}):</div>
          <ul className={styles.users}>
            {users.map((name, idx) => (
              <li className={styles.user} key={name + idx}>
                {name}
              </li>
            ))}
          </ul>
        </Sider>
        <Content>
          <div style={{ margin: '12px' }}>
            <div className={styles.messageWrapper} ref={messagesRef}>
              <ul>
                {messages?.map((message) => (
                  <li
                    className={message.userName === userName ? styles.userMessage : styles.message}
                    key={message?.text}>
                    <div className={styles.messageText}>{message.text}</div>
                    <div className={styles.messageInfo}>{message.userName}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <TextArea
                rows={4}
                value={messageText}
                onChange={(e) => {
                  setMessageText(e.target.value);
                }}
              />
              <Button onClick={onHandleSendMessage}>Отправить</Button>
            </div>
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default ChatComponent;

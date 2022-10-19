import React from 'react';
import 'antd/dist/antd.css';
import styles from './styles.scss';
import { RegisterComponent } from './RegisterComponent/RegisterComponent';
import { useSelector } from 'react-redux';
import ChatComponent from './ChatComponent/ChatComponent';

const App = () => {
  const { joined } = useSelector((state) => state.rooms);

  return (
    <div className={styles.content}>{!joined ? <RegisterComponent /> : <ChatComponent />}</div>
  );
};

export default App;

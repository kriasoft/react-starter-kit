import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';
import socketIOClient from "socket.io-client";
import ChatWS from '../../components/ChatWS';
import { userInfo } from 'os';

function Home() {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1>NDO</h1>
        <ChatWS/>
      </div>
    </div>
  );
}

export default withStyles(s)(Home);

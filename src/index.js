import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/auth.context';
import { NoticeProvider } from './context/notice.context';
import { SeatProvider } from './context/seat.context';
import { WebSocketProvider } from './context/websoket.context';
import './index.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <WebSocketProvider>
    <AuthProvider>
      <NoticeProvider>
        <SeatProvider>
          <App />
        </SeatProvider>
      </NoticeProvider>
    </AuthProvider>
  </WebSocketProvider>
);

reportWebVitals();

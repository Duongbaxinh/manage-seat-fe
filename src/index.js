import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/auth.context';
import { NoticeProvider } from './context/notice.context';
import { ObjectProvider } from './context/object.context';
import { WebSocketProvider } from './context/websoket.context';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { SeatProvider } from './context/seat.context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <WebSocketProvider>
    <AuthProvider>
      <NoticeProvider>
        <SeatProvider>
          <ObjectProvider>
            <App />
          </ObjectProvider>
        </SeatProvider>
      </NoticeProvider>
    </AuthProvider>
  </WebSocketProvider>
);

reportWebVitals();

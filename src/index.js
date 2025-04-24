import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { LoadingBarContainer } from 'react-top-loading-bar';
import App from './App';
import OnboardingModal from './components/molecules/OnboardingModal';
import { AuthProvider } from './context/auth.context';
import { OnboardingProvider } from './context/guide.context';
import { NoticeProvider } from './context/notice.context';
import { ObjectProvider } from './context/object.context';
import { SeatProvider } from './context/seat.context';
import { WebSocketProvider } from './context/websoket.context';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { SeatMapContextProvider } from './context/seatmap.context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <WebSocketProvider>
    <LoadingBarContainer>
      <AuthProvider>
        <NoticeProvider>
          <SeatProvider>
            <ObjectProvider>
              <ToastContainer />
              <OnboardingProvider>
                <SeatMapContextProvider>
                  <App />
                </SeatMapContextProvider>
                <OnboardingModal />
              </OnboardingProvider>
            </ObjectProvider>
          </SeatProvider>
        </NoticeProvider>
      </AuthProvider>
    </LoadingBarContainer>
  </WebSocketProvider>
);

reportWebVitals();

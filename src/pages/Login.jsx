import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth.context';
import { useWebSocketContext } from '../context/websoket.context';
import { handleAxiosError } from '../utils/handleError';
import LoadingPage from './LoadingPage';
const Login = ({ onLogin }) => {
  const { login, storeToken } = useAuth();
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { sendMessage } = useWebSocketContext();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9_]*$/;
    const passwordRegex = /^(?!.*<script)(?!.*<.*?>)[^\s]{6,16}$/;

    if (!usernameRegex.test(email)) {
      alert('Username must be correct format!!');
      return;
    }

    if (!passwordRegex.test(password)) {
      alert(
        'Password must be 6-16 characters.'
      );
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post('https://seatment-app-be-v2.onrender.com/auth/login', {
        username: email,
        password: password,
      });

      if (data && data.result.accessToken) {
        const user = {
          id: data.result.id,
          username: data.result.username,
          room: data.result.room,
          role: data.result.role,
        };

        storeToken(data.result.accessToken);
        login(user);

        await sendMessage(
          JSON.stringify({ type: 'auth', username: user.username, role: user.role })
        );
        navigate(`/seat-management/${user.room}`);
        setLoading(false);
      } else {
        setLoading(false);
        alert('Login failed! Invalid response from server.');
        navigate('/');
      }
    } catch (error) {
      setLoading(false);
      handleAxiosError(error);
    }
  };

  if (loading) return <LoadingPage loading={loading} />
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80)',
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Access Account</h1>
        <p className="text-center text-gray-600 mb-6">Please log in to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <div className="relative">
                <input
                  className="w-full px-4 py-2 bg-gray-100 rounded-md pl-10"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                  type="password"
                  className="w-full px-4 py-2 bg-gray-100 rounded-md pl-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>


          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md mt-6 hover:bg-blue-600 transition-colors"
          >
            Log In
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;

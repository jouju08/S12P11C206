import { useAuth } from '@/store/userStore';
import { use } from 'react';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const { Login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('이메일:', email, '비밀번호:', password);
  };

  return (
    <div className="flex h-screen w-full gap-3 bg-gray-500/65">
      <div className="flex-1 flex items-center justify-center bg-transparent">
        <div className="bg-white shadow-2xl p-8 w-96 max-w-[100%] rounded-xl">
          <h2 className="text-2xl font-bold mb-6 w-full h-full text-gray-800 text-center">
            <div className="flex justify-between">
              <button
                className={`w-1/2 py-2 text-center font-medium ${
                  isLogin
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-600'
                } focus:outline-none`}
                onClick={() => setIsLogin(true)}>
                Login
              </button>
              <button
                className={`w-1/2 py-2 text-center font-medium ${
                  !isLogin
                    ? 'text-green-500 border-b-2 border-green-500'
                    : 'text-gray-600'
                }  focus:outline-none`}
                onClick={() => setIsLogin(false)}>
                Sign Up
              </button>
            </div>
          </h2>

          {/* Sliding Forms Container */}
          <div className="relative w-full h-96 overflow-hidden">
            <div
              className={`absolute flex transition-transform duration-500 w-[200%] ${
                isLogin
                  ? 'transform translate-x-0'
                  : 'transform -translate-x-1/2'
              }`}>
              {/* Login Form */}
              <div className="w-1/2 px-8 py-8 bg-white">
                <h2 className="text-xl font-bold mb-4">Login</h2>
                <form>
                  <div className="mb-4">
                    <label
                      htmlFor="login-email"
                      className="block text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <input
                      type="email"
                      id="login-email"
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="login-password"
                      className="block text-sm font-medium text-gray-600">
                      Password
                    </label>
                    <input
                      type="password"
                      id="login-password"
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                    Login
                  </button>
                </form>
              </div>

              {/* Sign-Up Form */}
              <div className="w-1/2 px-8 py-8 bg-white">
                <h2 className="text-xl font-bold mb-4">Sign Up</h2>
                <form>
                  <div className="mb-4">
                    <label
                      htmlFor="signup-name"
                      className="block text-sm font-medium text-gray-600">
                      Name
                    </label>
                    <input
                      type="text"
                      id="signup-name"
                      className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="signup-email"
                      className="block text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <input
                      type="email"
                      id="signup-email"
                      className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="signup-password"
                      className="block text-sm font-medium text-gray-600">
                      Password
                    </label>
                    <input
                      type="password"
                      id="signup-password"
                      className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
                    Sign Up
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-screen flex items-center justify-center bg-yellow-200">
        <div className="bg-transparent p-2 w-full h-full max-w-[100%]"></div>
      </div>
    </div>
  );
}

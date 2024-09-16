"use client";

import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { login } from '../../src/features/auth/authSlice';
import { RootState } from '../../src/store/store';
import { loginStart, loginSuccess, loginFailure } from '../../src/features/auth/authSlice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailRef = useRef<HTMLInputElement>(null); // auto tab fill out
  const passwordRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();




  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (!error && user) {
      router.push('/');
    }
  }, [user, error]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.currentTarget === emailRef.current) {
        // Focus on password field
        passwordRef.current?.focus();
      } else if (e.currentTarget === passwordRef.current) {
  
      }
    }
  };

  return  (
    <div className="sm:flex">
      {/* Static Image */}
      <div className="flex-1 relative bg-primary hidden md:block">
        <div className="relative w-full h-full">
          <img
            src="https://t3.ftcdn.net/jpg/00/86/56/12/360_F_86561234_8HJdzg2iBlPap18K38mbyetKfdw1oNrm.jpg"
            alt="Image"
            layout="fill"
            objectFit="cover"
            className="w-full h-full"
          />
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-black">
            <div className="max-w-xl w-full mx-auto pb-32 px-5 relative">
              <h4 className="text-white text-2xl font-semibold mt-7"></h4>
              <p className="text-white text-lg mt-7 leading-8"></p>
            </div>
          </div>
        </div>
      </div>
      {/* Login Form */}
      <div>
        <div className="w-full lg:max-w-sm mx-auto space-y-10">
          <div className="bg-gray-200">
            <div className="fixed bottom-0 left-0 right-0 z-40 px-6 py-4 text-center text-white bg-gray-800">
            </div>
            <div className="min-h-screen flex items-center justify-center bg-blue-100 py-16 px-6 sm:px-12 lg:px-16">
              <hr className="my-8 border-gray-300" />
              <div className="max-w-md w-full space-y-12">
                <div>
                  <h2 className="mt-6 text-center text-4xl font-bold text-gray-900">
                    Login
                  </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                  <input type="hidden" name="remember" value="true" />
                  <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                      <label htmlFor="email-address-l" className="sr-only">Email address</label>
                      <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        ref={emailRef}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Email address"
                      />
                    </div>
                    <div>
                      <label htmlFor="password-l" className="sr-only">Password</label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        ref={passwordRef}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Password"
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      type='submit'
                      className='w-full bg-indigo-600 text-white py-2 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300'
                    >
                      Log In
                    </button>
                    {error && (
                      <p className='pt-5 text-center text-red-600'>
                        {error}
                      </p>
                    )}
                    <p className='pt-5 text-center text-gray-600'>
                      Don't have an account?{' '}
                      <a href='/register' className='text-indigo-600 font-medium ml-1 hover:underline'>
                        Sign up
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

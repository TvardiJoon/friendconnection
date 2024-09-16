"use client"
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { register } from '../../src/features/auth/authSlice';
import { RootState } from '../../src/store/store';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const repeatPasswordRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const { loading, error: authError, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();


    useEffect(() => { //
    if (authError) {
      // Handle registration error
      console.error('Registration failed:', authError);
      setError('Registration failed. Please try again.');
    } else if (!loading && user) {
      // Registration successful
      router.push('/');
    }
  }, [user, authError, loading]);

    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();

      if (password !== repeatPassword) {
        setError('Passwords do not match.');
        return;
      }

      const resultAction = await dispatch(register({ firstName, lastName, email, password }));

      if (register.fulfilled.match(resultAction)) {
        // Registration successful
        // Redirect or perform other actions
      } else if (register.rejected.match(resultAction)) {
        // Registration failed
        setError(resultAction.payload as string);
      }
    };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.currentTarget === firstNameRef.current) {
        lastNameRef.current?.focus();
      } else if (e.currentTarget === lastNameRef.current) {
        emailRef.current?.focus();
      } else if (e.currentTarget === emailRef.current) {
        passwordRef.current?.focus();
      } else if (e.currentTarget === passwordRef.current) {
        repeatPasswordRef.current?.focus();
      } else if (e.currentTarget === repeatPasswordRef.current) {

      }
    }
  };

  return (
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

            </div>
          </div>
        </div>
      </div>
      {/* Registration Form */}
      <div className="w-full lg:max-w-sm mx-auto space-y-10">
        <div className="min-h-screen flex items-center justify-center bg-blue-100 py-16 px-6 sm:px-12 lg:px-16">
          <hr className="my-8 border-gray-300" />
          <div className="max-w-md w-full space-y-12">
            <div>
              <h2 className="mt-6 text-center text-4xl font-bold text-gray-900">
                Register
              </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleRegister}>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="first-name" className="sr-only">First Name</label>
                  <input
                    id="first-name"
                    name="firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="First Name"
                    ref={firstNameRef}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="last-name" className="sr-only">Last Name</label>
                  <input
                    id="last-name"
                    name="lastName"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Last Name"
                    ref={lastNameRef}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  ref={emailRef}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  ref={passwordRef}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div>
                <label htmlFor="repeat-password" className="sr-only">Repeat Password</label>
                <input
                  id="repeat-password"
                  name="repeatPassword"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Repeat Password"
                  ref={repeatPasswordRef}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div>
                <button
                  type='submit'
                  className='w-full bg-indigo-600 text-white py-2 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300'
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
                {error && (
                  <p className='pt-5 text-center text-red-600'>
                    {error}
                  </p>
                )}
                <p className='pt-5 text-center text-gray-600'>
            Have an account?{' '}
            <a href='/login' className='text-indigo-600 font-medium ml-1 hover:underline'>
              Login here
            </a>
          </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

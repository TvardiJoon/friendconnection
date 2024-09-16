'use client';

import { Provider } from 'react-redux';
import { store } from '../src/store/store'; // Adjust the path if needed
import "../styles/globals.css";
import { useEffect, useState } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Ensure this component only renders on the client side
  if (!isClient) {
    return null;
  }

  return (
    <html lang="en">

      <body className="bg-gray-100 text-gray-900">
        <Provider store={store}>
          <main>
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}

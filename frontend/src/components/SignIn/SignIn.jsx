import React from 'react';
import {useAuth0} from "@auth0/auth0-react"

const SignIn = () => {
    const {loginWithRedirect} = useAuth0()

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold animate-bounce text-primary">Welcome AnonLink</h1>
        <button
          className="btn btn-primary btn-wide animate-pulse"
          onClick={() => loginWithRedirect()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-6 h-6 mr-2"
          >
            <path
              fill="#4285F4"
              d="M24 9.5c3.2 0 5.4 1.4 6.6 2.5l4.9-4.9C32.4 4.5 28.7 3 24 3 14.6 3 7 10.6 7 20s7.6 17 17 17c4.6 0 8.5-1.7 11.3-4.4l-4.9-4.9c-1.4 1.3-3.8 2.7-6.4 2.7-5.8 0-10.5-4.7-10.5-10.5S18.2 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.5 24.5c0-1.3-.1-2.5-.4-3.7H24v7.1h12.6c-.5 2.6-2.2 4.8-4.7 6.2v5.2h7.6c4.5-4.1 7-10.2 7-14.8z"
            />
            <path
              fill="#FBBC05"
              d="M36.9 33.4C35.3 34.5 32.6 36 29 36c-5.8 0-10.5-4.7-10.5-10.5S23.2 15 29 15c2.5 0 4.6 1 6 2.5l4.5-4.5C36.5 10.4 32.4 9 29 9c-8.3 0-15 6.7-15 15s6.7 15 15 15c4.1 0 7.5-1.5 10-4.1l-4.1-4.5z"
            />
            <path fill="#EA4335" d="M36.9 33.4l-4.1 4.5C33.2 38.5 30.6 39.5 27 39.5c-8.3 0-15-6.7-15-15s6.7-15 15-15c4.1 0 7.5 1.5 10 4.1l4.1-4.5z" />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default SignIn;

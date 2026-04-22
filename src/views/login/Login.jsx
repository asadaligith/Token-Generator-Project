import { ErrorMessage, Field, Form, Formik } from 'formik';
import React from 'react'

import { Link} from "react-router";

function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Login Form
                </h2>

                <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                    Login with Facebook
                </button>
            </div>
        </div>
  )
}

export default Login


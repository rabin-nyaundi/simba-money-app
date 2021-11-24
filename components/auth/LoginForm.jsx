import Link from "next/link";
import { useRef } from "react";

export default function LoginForm({handleLogin}) {

    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    function handleSubmit(e) {
        e.preventDefault();

      let loginData = {
        email: emailInputRef.current.value,
        password: passwordInputRef.current.value,
      };

      handleLogin(loginData);
    }
    return (
      <>
        <div className="w-full max-w-sm">
          <form
            className="bg-white shadow-md rounded px-8 pb-8 mb-4"
            onSubmit={handleSubmit}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
                required
                ref={emailInputRef}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Password"
                required
                ref={passwordInputRef}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Login
              </button>
              <Link href="/auth/signup">
                <button className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                  Dont have an Account? Register
                </button>
              </Link>
            </div>
          </form>
        </div>
      </>
    );
}

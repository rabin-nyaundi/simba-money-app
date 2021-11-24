import "tailwindcss/tailwind.css";

import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";


function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session} refetchInterval={5 * 60}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Component {...pageProps} />;
    </SessionProvider>
  );
}

export default MyApp;

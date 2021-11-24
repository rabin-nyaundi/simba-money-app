import { ToastContainer } from "react-toastify";
import LoginForm from "../../components/auth/LoginForm";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { Router, useRouter } from "next/dist/client/router";


export default function Login() {

  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'authenticated') {
    router.push('/');
    return;
  }

  async function handleLogin(data) {
    let email = data.email;
    let password = data.password;
    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: "https://simba-money-transfer-web-app.vercel.app/",
    });
    return result;
  }
  return (
    <>
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
      <div className="flex flex-col mt-10 py-8 px-8 mx-auto items-center">
        <LoginForm handleLogin={handleLogin} />
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session
    }
  }
}

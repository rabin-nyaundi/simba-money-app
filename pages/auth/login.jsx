import { toast, ToastContainer } from "react-toastify";
import LoginForm from "../../components/auth/LoginForm";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { Router, useRouter } from "next/dist/client/router";


export default function Login({session}) {


  async function handleLogin(data) {
    let email = data.email;
    let password = data.password;
    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl: `${window.location.origin}/transact`,
      // redirect: false
    })
    if (res?.error) {
      toast.error(res.error);
      console.log(res.error);
    }
    
    return res;
  }
  return (
    <>
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

import { getSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import SignupForm from "../../components/auth/SignupForm";

export default function SignUp() {
  const router = useRouter();

  async function handleSignup(data) {
    const apiResponse = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 400) {
          toast.error(`Failed! ${res.message}`);
          return;
        } else {
          toast.success(`Success ${res.message}`)
          router.push("/auth/login");
        }
    });
    
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
        <SignupForm handleSignup={handleSignup} />
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
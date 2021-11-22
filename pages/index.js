import { useRouter } from "next/dist/client/router";
import { useSession, signOut, signIn } from "next-auth/react";
import { getSession } from "next-auth/react";
import Layout from "../components/Layout/Layout";
import { useState } from "react";

export default function App({ sessionUser }) {
  const { data: session, status } = useSession();
  const [mySession, setMySession] = useState([]);

  async function getMySession() {
    const session = await getSession();
    console.log(session);
    setMySession(session.user.email);
  }

  const router = useRouter();

  if (status === "unauthenticated") {
    return (
      <p className="flex flex-col items-center justify-center">
        You are not authenticated. Login first
      </p>
    );
  }

  return (
    <>
      <Layout>
        <p>
          Welcome <b>{sessionUser.token.email}</b> to the <b>Simba Bank</b>{" "}
          You can send money to other users and see their balance. We currently support 3 currencies:{" "}
          namely{" "} <b>USD, EUR and NGN</b>
        </p>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
  return {
    props: {
      sessionUser: session
    }
  };
}

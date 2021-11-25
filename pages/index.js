import { getSession } from "next-auth/react";
import Layout from "../components/Layout/Layout";

export default function App({ session }) {

  return (
    <>
      <Layout>
        <p>
          Welcome <b>{session.token.email}</b> to the <b>Simba Bank</b>{" "}
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
      session
    }
  };
}

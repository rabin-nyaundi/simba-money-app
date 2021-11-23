import prisma from "../../lib/prisma";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from 'next/router'

import Layout from "../../components/Layout/Layout";
import TransactionForm from "../../components/ui/TransactionForm";
import { toast } from "react-toastify";


export default function Transaction({ users, currency }) {

    const { data: session, status } = useSession();
    const router = useRouter();

    const handleTransaction = async (transactionData) => {
        console.log(transactionData);
        const result = await fetch('/api/transaction', {
            method: "POST",
            body: JSON.stringify(transactionData),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json())
            .then((res) => {
                if (res.status === 400) {
                    toast.error(`Oops! ${res.message}`);
                    // router.push("/transact/new");
                    return;
                }
                toast.success(`Success! ${res.message}`)
                router.push("/transact");
                console.log(res);
            })
    }

    if (status !== "authenticated") {
        return (
            <p>You are not authenticated</p>
        )
    }


    return (
        <>
            <Layout>
                <div className="flex py-5 justify-center items-center">
                    <TransactionForm users={users} currency={currency} handleTransaction={handleTransaction} />
                </div>
            </Layout>

        </>
    )
}

export async function getServerSideProps(context) {

    const session = await getSession({ req: context.req });

    if (!session) {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
            }
        }
    }

    const users = await prisma.user.findMany({
        include: {
            transactions: {
                select: {
                    id: true
                }
            }
        }
    })

    const currency = await prisma.currency.findMany({});
    return {
        props: {
            users: users,
            currency: currency
        }
    }
}
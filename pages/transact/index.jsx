import Link from 'next/link';
import prisma from "../../lib/prisma";
import Layout from "../../components/Layout/Layout";
import Table from "../../components/ui/Table/Table";
import { getSession } from "next-auth/react";

export default function Index({ transactions, user, balances }) {

    return (
        <>
            <Layout>
                <div className="flex flex-row w-full p-4 justify-between">
                    <div className="flex flex-row justify-between p-4">
                        {balances.map((account, key) => (
                            <div key={key} className="flex">
                                <span className="font-bold ml-4 mr-4">Balance :</span> <span class="bg-green-600 text-white text-lg font-medium mr-2 px-2.5 py-0.5 rounded-md">{account.balance} USD</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-row">
                        <Link href="/transact/new-transaction">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-sm px-2 rounded focus:outline-none focus:shadow-outline">
                                New Transaction
                            </button>
                        </Link>
                    </div>
                </div>
                <Table transactions={transactions} />
            </Layout>

        </>
    )
}

export async function getServerSideProps(context) {

    const { req } = context;

    const session = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: '/auth/login',
                permanent: false,
            }
        }
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.token.email
        }
    })


    const transactions = await prisma.transaction.findMany({
        include: {
            sender: {
                select: {
                    name: true
                }
            },
            receiver: {
                select: {
                    name: true
                }
            },
            currency: {
                select: {
                    code: true
                }
            },

        }
    })

    const balances = await prisma.account.findMany({
        where: {
            userId: Number(session.token.sub)
        }
    });

    console.log("balances", balances);
    return {
        props: {
            transactions: transactions,
            user: user,
            session: session,
            balances: balances
        }
    }
}

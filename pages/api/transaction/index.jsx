import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import CC from "currency-converter-lt";

export default async function handler(req, res) {
    const { receiver, currency, amount } = req.body;

    let convertedAmount;
    let status = true;
    let receiverAccount;
    // let senderAccount;
    
    const session = await getSession({ req });

    console.log(session)

    // Find the user logged in or sending money
    const user = await prisma.user.findUnique({
        where: {
            email: session.token.email,
        },
    });

    // Find the sending account (to be debited)
    const senderAccount = await prisma.account.findFirst({
        where: {
            AND: [
                {
                    userId: {
                        equals: user.id
                    },
                    currencyId: {
                        equals: Number(1)
                    }
                }
            ]
            // userId: user.id,
        }
    });
    // If it doesn't exist, return error
    if (!senderAccount) {
        return res.status(400).json({ message: "Invalid sender account", status: 400 });
    }

    // Find receiver user who is being transferred to 
    const receiverUser = await prisma.user.findUnique({
        where: {
            id: Number(receiver),
        },
    });

    // find receiver user's account which matches the target currency(account to be credited)
    receiverAccount = await prisma.account.findFirst({
        where: {
            AND: [
                {
                    userId: {
                        equals: Number(receiver),
                    },
                    currencyId: {
                        equals: Number(currency),
                    }
                }
            ]
        }
    })

    
    // If it does not exist, return error
    if (!receiverAccount) {
        receiverAccount = await prisma.account.create({
            data: {
                userId: receiverUser.id,
                currencyId: Number(currency),
                balance: Number(0)
            }
        })

        return receiverAccount;
        // return res.status(400).json({ message: "Invalid receiver account", status: 400 });
    }


    console.log('====================================');
    console.log(receiverAccount, "Receiver Account and balance");
    console.log('====================================');

    // If it does not exist, rollback but create transaction to track
    if (senderAccount.balance < amount) {
        status = false;
        await prisma.transaction.create({
            data: {
                senderId: user.id,
                userId: Number(receiver),
                value: Number(amount),
                currencyId: Number(currency),
                code: Date.now().toString(),
                // exchangeRate: 113,
                status: status,
            },
        });
        res
            .status(400)
            .json({ message: "Insufficient funds, transaction failed", status: 400 });
    } else {
        // Amount is enough to transfer


        const targetCurrency = await prisma.currency.findFirst({
            where: {
                id: Number(currency),
            }
        })


    
        // else convert source currency to target currency
        let currencyConverter = new CC({
            from: "USD",
            to: targetCurrency.code,
            amount: Number(amount),
        });


        const curr = await currencyConverter.convert().then((response) => {
            return (convertedAmount = response);
        });


        const newBalance = senderAccount.balance - Number(amount);

        const receiverBalance =
            receiverAccount.balance + Number(convertedAmount);
        
      

        // Find sender account with matching currency
        // update the balance

    


        // const userAccount = await prisma.account.findFirst({
        //     where: {
        //         userId: Number(session.token.sub),
        //     },
        // });
        // if (!userAccount) {
        //     res.status(400).json({ message: "Account not found", status: 400 });
        // }

        await prisma.account.updateMany({
            
            where: {
                userId: senderAccount.id,
                currencyId: senderAccount.currencyId
            },
            data: {
                balance: Number(newBalance),
            },
        });

        // Find receiver of the money sent
        // get account with matching currency sent
        // update the balance


        // Get the account with matching currency

        await prisma.account.updateMany({
            where: {
                userId: receiverAccount.userId,
                currencyId:  receiverAccount.currencyId,
            },
            data: {
                balance: Math.floor(receiverBalance),
            },
        });

        const newTransaction = await prisma.transaction.create({
            data: {
                senderId: user.id,
                userId: receiverUser.id,
                value: Math.floor(convertedAmount),
                currencyId: Number(currency),
                code: Date.now().toString(),
                // exchangeRate: 113,
                status: status,
            },
        });
        res
            .status(200)
            .json({
                message: "Transaction successful",
                status: 200,
                transaction: newTransaction,
            });
    }

    res.status(405).send(`Method ${req.method} Not Allowed`);
}

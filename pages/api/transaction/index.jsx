import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import CC from 'currency-converter-lt'


export default async function handler(req, res) {
    const { receiver, currency, amount } = req.body;

    let convertedAmount;
    let status = true;
    const session = await getSession({ req });
    const user = await prisma.user.findUnique({
        where: {
            email: session.token.email,
        }
    });

    if (user.accountBalance < amount) {
        status = false;
        await prisma.transaction.create({
            data: {
                senderId: user.id,
                userId: Number(receiver),
                value: Number(amount),
                currencyId: Number(currency),
                code: Date.now().toString(),
                exchangeRate: 113,
                status: status
            }
        });
        res.status(400).json({ message: "Insufficient funds, transaction failed", status: 400 });
    }
    else {
        // Amount is enough to transfer
        // get target currency
        // convert source currency to target currency
        // update sender account balance
        // update receiver account balance
        // create transaction

        const targetCurrency = await prisma.currency.findFirst({
            where: {
                id: Number(currency)
            }
        });

        if (targetCurrency) {

            let currencyConverter = new CC({ from: "USD", to: targetCurrency.code, amount: Number(amount) });

            const curr = await currencyConverter.convert().then((response) => {
                return convertedAmount = response;
            })
            // return curr;
        }

        const newBalance = user.accountBalance - Number(amount);
        const receiverUser = await prisma.user.findUnique({
            where: {
                id: Number(receiver)
            }
        });

        const receiverBalance = receiverUser.accountBalance + Number(convertedAmount);

        // Find sender account with matching currency
        // update the balance

        const userAccount = await prisma.account.findFirst({
            where: {
                userId: Number(session.token.sub),
            }
        });
        if (userAccount) {
            await prisma.account.update({
                where: {
                    id: userAccount.id
                },
                data: {
                    balance: Number(newBalance)
                }
            });
        }

        // const userSend = await prisma.user.update({
        //     where: {
        //         id: user.id
        //     },
        //     data: {
        //         accountBalance: Number(newBalance)
        //     }
        // });

        // Find receiver account with matching currency
        // update the balance   
        await prisma.user.update({
            where: {
                id: receiverUser.id
            },
            data: {
                accountBalance: Math.floor(receiverBalance),
            }
        });

        const newTransaction = await prisma.transaction.create({
            data: {
                senderId: user.id,
                userId: receiverUser.id,
                value: Math.floor(convertedAmount),
                currencyId: Number(currency),
                code: Date.now().toString(),
                exchangeRate: 113,
                status: status
            }
        });
        res.status(200).json({ message: "Transaction successful", status: 200, transaction: newTransaction });
    }


    // convert currency
    // let convertedAmount;
    // let currencyConverter = new CC({ from: "USD", to: "EUR", amount: Number(amount) });

    // const curr = await currencyConverter.convert().then((response) => {
    //     return convertedAmount = response;
    // })

    // if (req.method === 'POST') {


    //     console.log("Session user",session.token);
    //     const transaction = await prisma.transaction.create({
    //         data: {
    //             senderId: Number(session.token.sub),
    //             userId: Number(receiver),
    //             code: Date.now().toString(),
    //             currencyId: Number(currency),
    //             exchangeRate: 113,
    //             value: Math.floor(convertedAmount),
    //             status: status
    //         }
    //     })
    //     res.status(200).json({message: "transaction created", data: transaction})
    // }
    res.status(405).send(`Method ${req.method} Not Allowed`);
}
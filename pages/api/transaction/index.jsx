import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import CC from 'currency-converter-lt'


export default async function handler(req, res) {

    let status = true;
    const { receiver, currency, amount } = req.body;
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
        const newBalance = user.accountBalance - Number(amount);
        const receiverUser = await prisma.user.findUnique({
            where: {
                id: Number(receiver)
            }
        });

        const receiverBalance = receiverUser.accountBalance + Number(amount);

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                accountBalance: Number(newBalance)
            }
        });

        await prisma.user.update({
            where: {
                id: receiverUser.id
            },
            data: {
                accountBalance: Number(receiverBalance)
            }
        });

        const newTransaction = await prisma.transaction.create({
            data: {
                senderId:  user.id,
                userId: receiverUser.id,
                value: Number(amount),
                currencyId: Number(currency),
                code: Date.now().toString(),
                exchangeRate: 113,
                status: status
            }
        });
        res.status(200).json({ message: "Transaction successful", status: 200, transaction: newTransaction });
    }

    await prisma.user.create({
        data: {
            names: names,
            email: email,
            password: await bcrypt.hash(password, 8)
        }
    })

    await prisma.account.create({
        data: {
            userId: newUser.id,
            amount: 1000,
            currency: "USD"
        }
    })

    
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
import prisma from "../../../lib/prisma";
import { hash } from "bcryptjs";


export default async function handler(req, res) {
  const { name, email, password } = req.body;

  if (req.method === "POST") {
    // input validation
    if (!name || !email || !email.includes('@') || !password) {
      res.status(400).json({
        message: "Please provide name, email and password",
      });
      return;
    }
    //check if user already exists
    const findUser = await prisma.user.findFirst({
      where: { email: email },
    });

    console.log(findUser);

    if (findUser) {
      res.status(400).json({ status: 400, message: "User already exist" });
      return;
    } else {
      const user = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: await hash(password, 12),
        },
      });

      const currency = await prisma.currency.findFirst({
        where: {
          code: 'USD'
        }
      });

      if (currency) {
        await prisma.account.create({
          data: {
            userId: user.id,
            currencyId: currency.id,
            balance: 1000,
          }
        });
        res.status(200).json({ message: "Account created successfully" });
      }

      else {
        await prisma.currency.createMany({
          data: [
            {
              code: 'USD',
            },
            {
              code: 'NGN'
            },
            {
              code: "EUR"
            }
          ]
        })
        res.status(200).json({ message: "Currencies created" });
      }

      const USDCurrency = await prisma.currency.findFirst({
        where: {
          code: "USD",
        }
      });

      if (USDCurrency) {
        const accountUSD = await prisma.account.findFirst({
          where: {
            AND: [
              {
                userId: {
                  equals: user.id
                },
                currencyId: {
                  equals: USDCurrency.id
                }
              }
            ]
          }
        })

        if (!accountUSD) {
          
          await prisma.account.create({
            data: {
              userId: user.id,
              currencyId: USDCurrency.id,
              balance: 1000
            }
          })
        }

      }

      const transaction = await prisma.transaction.create({
        data: {
          senderId: user.id,
          userId: user.id,
          value: 1000,
          currencyId: USDCurrency.id,
          code: Date.now().toString(),
          // exchangeRate: 113,
          status: true
        }
      })

      res.status(200).json({ message: "User created", user: user });
    }
  }
  res.status(405).send(`Method ${req.method} Not Allowed`);
}

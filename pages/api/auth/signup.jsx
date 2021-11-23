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
          code: "USD",
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
        res.status(400).json({ message: "Bank not found" });
      }


      const transaction = await prisma.transaction.create({
        data: {
          senderId: user.id,
          userId: user.id,
          value: 1000,
          currencyId: currency.id,
          code: Date.now().toString(),
          exchangeRate: 113,
          status: true
        }
      })

      res.status(200).json({ message: "User created", user: user });
    }
  }
  res.status(405).send(`Method ${req.method} Not Allowed`);
}

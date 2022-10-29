import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();

const routeUser = express.Router();
// create user route
routeUser.post("/user", async (req, res) => {
    const { name, lastName, documentType,documentNumber,birthDate,gender, email,phone,cityId } = req.body;
    const user = await prisma.user.create({
        data: {
            name: name,
            lastName: lastName,
            documentType: documentType,
            documentId: documentNumber,
            dateOfBirth: birthDate,
            gender: gender,
            phoneNumber: phone,
            email: email,
            cityId: cityId,
            
                    
        },
    });
    res.json(user);
});

//search user by email and return user id
routeUser.get("/user/", async (req, res) => {
    const email: string = req.headers.email as string;
    let user = await prisma.user.findMany({
        where: {
            email: email,
        },
        select: {
            id: true,
        }
    });
    res.json(user);
});

routeUser.patch("/user/:id", async (req, res) => {
    console.log('entro al get')
    const id: string = req.params.id as string;
    let user = await prisma.user.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            name: true,
            lastName: true,
            documentType: true,
            documentId: true,
            dateOfBirth: true,
            gender: true,
            phoneNumber: true,
            email: true,
            cityId: true,
        },
    });
    
    let getDetails = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        roleUser: {
          select: {
            isAdmin: true,
          },
        },
      },
    });
    res.json({user, getDetails});
    
});

export default routeUser;
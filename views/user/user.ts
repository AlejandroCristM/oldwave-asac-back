import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();

const routeUser = express.Router();
// create user route
routeUser.post("/user", async (req, res) => {
    const { name, lastName, documentType,documentNumber,birthDate,gender, email,phone,cityId,addressId } = req.body;
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
    if(user.length > 0){
      let getDetails = await prisma.user.findUnique({
          where: {
            id: user[0].id,
          },
          select: {
            roleUser: {
              select: {
                isAdmin: true,
              },
            },
          },
        });
        if(getDetails?.roleUser===null){
          getDetails.roleUser = {isAdmin: false}
          res.json({user, getDetails});
        }
      res.json({user, getDetails});
    }
    res.json(null);

});

routeUser.patch("/user/:id", async (req, res) => {
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

routeUser.get("/client/:id", async (req, res) => {
    const id: string = req.params.id as string;
    let client = await prisma.client.findUnique({
        where: {
            userId: id,
        },
        select: {
            orders: {
                select: {
                    id: true,
                    clientId: true,
                    addressId: true,
                    invoiceAddress: true,
                    shipmentDate: true,
                    paymentMethod: true,
                    deliveryStatus: true,
                    trackNumber: true,
                    total: true,
                    details: true,
                },
            },
            shoppingCart: {
                select: {
                    id: true,
                    clientId: true,
                    total: true,
                    details: true,
                },
            },
            userId: true,
            addressId: true,
        },
    });
    res.json(client);
});

routeUser.post("/client", async (req, res) => {
    const { userId, addressId } = req.body;
    const client = await prisma.client.create({
        data: {
            userId: userId,
            addressId: addressId,
        },
    });
    res.json(client);
});



export default routeUser;
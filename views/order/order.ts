import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();

const routeOrder = express.Router();

routeOrder.post("/order", async (req, res) => { 
    const { clientId,addressId,invoiceAddress,shipmentDate,paymentMethod,deliveryStatus,trackNumber, total, details,  } = req.body;
    const order = await prisma.order.create({
        data: {
            clientId: clientId,
            addressId: addressId,
            invoiceAddress: invoiceAddress,
            shipmentDate: shipmentDate,
            paymentMethod: paymentMethod,
            deliveryStatus:deliveryStatus,
            trackNumber: trackNumber,
            total: total,
            details: details,
        }
    });
    res.json(order);
});

// routeOrder.get("/order/:id", async (req, res) => {
//     const id: string = req.params.id as string;
//     let order = await prisma.order.findUnique({
//         where: {
//             id: id,
//         },
//         select: {
//             id: true,
//             clientId: true,
//             addressId: true,
//             invoiceAddress: true,
//             shipmentDate: true,
//             paymentMethod: true,
//             deliveryStatus: true,
//             trackNumber: true,
//             total: true,
//             details: true,
//         },
//     });
//     res.json(order);
// });

routeOrder.get("/order/:id", async (req, res) => {
    const id: string = req.params.id as string;
    let order = await prisma.user.findUnique({
        where: {
            id: id,
        },
        select: {
            client: {
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
                },
            },
        },
    });
    res.json(order);
});


routeOrder.get("/order", async (req, res) => {   
    let order = await prisma.order.findMany({
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
    });
    res.json(order);
});


export default routeOrder;
import { PrismaClient } from "@prisma/client";
import { strict } from "assert";
import express from "express";

const prisma = new PrismaClient();

const routeShoppingCart = express.Router();


routeShoppingCart.get("/cart/:id", async (req, res) => {
    const id: string = req.params.id as string;
    let getDetails = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        client: {
          select: {
            shoppingCart: {
              select: {
                id: true,
                total: true,
                details: {
                  select: {
                    id: true,
                    units: true,
                    cartProduct: {
                      select: {
                        name: true,
                        stock: true,
                        thumbnail: true,
                        value: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    res.json(getDetails);
});

routeShoppingCart.get("/cart", async (req, res) => {
  //header
  const id: string = req.headers.id as string;
    let getDetails = await prisma.user.findUnique({
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
        client: {
          select: {
            shoppingCart: {
              select: {
                id: true,
                total: true,
                details: {
                  select: {
                    id: true,
                    units: true,
                    cartProduct: {
                      select: {
                        name: true,
                        stock: true,
                        thumbnail: true,
                        value: true,
                      },
                    },
                  },
                },
              },
            },
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
    res.json(getDetails);
});

routeShoppingCart.delete('/cart/:id', async (req, res) => {
  const id: string = req.params.id as string;
  const product = await prisma.shoppingCartDetails.delete({
    where: {
      id: id,
    },
  })
  res.json('se eliminó correctamente')
})

routeShoppingCart.post('/cart', async (req, res) => {
  const { shoppingCartId, productId, value, units, subTotal } = req.body
  const post = await prisma.shoppingCartDetails.create({
    data: {
      shoppingCartId : shoppingCartId,
      productId : productId,
      value : value,
      units : units,
      subTotal : subTotal
    },
  });
  
  res.json(post)
})

routeShoppingCart.patch('/cart/', async (req, res) => {
  const { shoppingCartId, productId, value} = req.body
  const product = await prisma.shoppingCartDetails.findMany({
    where: {
      productId: productId,
      shoppingCartId: shoppingCartId,
    },
    select: {
      id: true,
      units: true,
    },
  })
  const units = product[0].units + 1
  //increase one units
  if(value==1){
    const units = product[0].units + 1
    const products = await prisma.shoppingCartDetails.update({
      where: {
        id: product[0].id,
      },
      data: {
        units: units,
      },
    })
    res.json(products)
    //decrease one units
  }else if(value==-1){
    const units = product[0].units - 1
    const products = await prisma.shoppingCartDetails.update({
      where: {
        id: product[0].id,
      },
      data: {
        units: units,
      },
    })
    res.json(products)
  }else if(value==0){
    const products = await prisma.shoppingCartDetails.delete({
      where: {
        id: product[0].id,
      },
    })
    res.json('se eliminó correctamente')
  }
  });


export default routeShoppingCart;
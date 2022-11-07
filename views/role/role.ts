import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();

const routeRole = express.Router();


routeRole.get("/role/:id", async (req, res) => {
    const id: string = req.params.id as string;
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
    res.json(getDetails);
});
//create role
routeRole.post("/role", async (req, res) => {
  const { userId, isAdmin } = req.body;
  const newRole = await prisma.role.create({
    data:{
      userId: userId,
      isAdmin: isAdmin
    }
  });
  res.json(newRole);
});

export default routeRole;
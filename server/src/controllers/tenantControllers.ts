import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface RequestWithParams extends Request {
  params: {
    cognitoId: string;
  };
}

export const getTenant = async (
  req: RequestWithParams,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const tenant = await prisma.tenant.findUnique({
      where: { cognitoId },
      include: {
        favorites: true,
      },
    });
    if (tenant) {
      res.status(200).json(tenant);
    } else {
      res.status(404).json({ message: "Tenant not found" });
    }
  } catch (error: any) {
    res.status(400).json(`Error retreiving tenant ${error.message}`);
  }
};

interface RequestWithBody extends Request {
  body: {
    cognitoId: string;
    name: string;
    email: string;
    phoneNumber: string;
  };
}

export const createTenant = async (
  req: RequestWithBody,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, name, email, phoneNumber } = req.body;
    const tenant = await prisma.tenant.create({
      data: {
        cognitoId,
        name,
        email,
        phoneNumber,
      },
    });
    res.status(201).json(tenant);
  } catch (error: any) {
    res.status(400).json(`Error creating tenant ${error.message}`);
  }
};

interface UpdateTenantRequest extends Request {
  params: {
    cognitoId: string;
  };
  body: {
    name: string;
    email: string;
    phoneNumber: string;
  };
}

export const updateTenant = async (
  req: UpdateTenantRequest,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const { name, email, phoneNumber } = req.body;
    const updateTenant = await prisma.tenant.update({
      where: {
        cognitoId,
      },
      data: {
        name,
        email,
        phoneNumber,
      },
    });
    res.status(201).json(updateTenant);
  } catch (error: any) {
    res.status(400).json(`Error updating tenant ${error.message}`);
  }
};

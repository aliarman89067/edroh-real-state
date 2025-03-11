import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";

const prisma = new PrismaClient();

interface RequestWithParams extends Request {
  params: {
    cognitoId: string;
  };
}

export const getManager = async (
  req: RequestWithParams,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const manager = await prisma.manager.findUnique({
      where: { cognitoId },
    });
    if (manager) {
      res.status(200).json(manager);
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

export const createManager = async (
  req: RequestWithBody,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, name, email, phoneNumber } = req.body;
    const manager = await prisma.manager.create({
      data: {
        cognitoId,
        name,
        email,
        phoneNumber,
      },
    });
    res.status(201).json(manager);
  } catch (error: any) {
    res.status(400).json(`Error creating tenant ${error.message}`);
  }
};

interface UpdateManagerRequest extends Request {
  params: {
    cognitoId: string;
  };
  body: {
    name: string;
    email: string;
    phoneNumber: string;
  };
}

export const updateManager = async (
  req: UpdateManagerRequest,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const { name, email, phoneNumber } = req.body;
    const updateManager = await prisma.manager.update({
      where: {
        cognitoId,
      },
      data: {
        name,
        email,
        phoneNumber,
      },
    });
    res.status(201).json(updateManager);
  } catch (error: any) {
    res.status(400).json(`Error updating manager ${error.message}`);
  }
};

export const getManagerProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const manager = await prisma.manager.findUnique({
      where: {
        cognitoId,
      },
    });
    if (!manager) {
      res.status(404).json({ message: "Invalid cognitoId!" });
    }
    const properties = await prisma.property.findMany({
      where: {
        managerCognitoId: cognitoId,
      },
      include: {
        location: true,
      },
    });
    const propertiesWithFormattedLocation = await Promise.all(
      properties.map(async (property) => {
        const coordinates: { coordinates: string }[] = await prisma.$queryRaw`
                SELECT ST_asText(coordinates) as coordinates FROM "Location" WHERE id = ${property.location.id}
            `;
        const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
        const longitude = geoJSON.coordinates[0];
        const latitude = geoJSON.coordinates[1];

        return {
          ...property,
          location: {
            ...property.location,
            coordinates: {
              longitude,
              latitude,
            },
          },
        };
      })
    );
    res.json(propertiesWithFormattedLocation);
  } catch (error: any) {
    res.status(500).json({ message: "Error retreiving manager plural", error });
  }
};

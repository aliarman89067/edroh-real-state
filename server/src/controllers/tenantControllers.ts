import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";

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

export const getCurrentResidences = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const tenant = await prisma.tenant.findUnique({
      where: {
        cognitoId,
      },
    });
    if (!tenant) {
      res.status(404).json({ message: "Invalid cognitoId!" });
    }
    const properties = await prisma.property.findMany({
      where: {
        tenants: { some: { cognitoId } },
      },
      include: {
        location: true,
      },
    });
    const residencesWithFormattedLocation = await Promise.all(
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
    res.json(residencesWithFormattedLocation);
  } catch (error: any) {
    res.status(500).json({ message: "Error retreiving manager plural", error });
  }
};

export const addFavoriteProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, propertyId } = req.params;
    const tenant = await prisma.tenant.findUnique({
      where: {
        cognitoId,
      },
      include: {
        favorites: true,
      },
    });
    const propertyIdNumber = Number(propertyId);
    const tenantFavorites = tenant?.favorites || [];
    if (!tenantFavorites.some((prev) => prev.id === propertyIdNumber)) {
      const updatedTenant = await prisma.tenant.update({
        where: {
          cognitoId,
        },
        data: {
          favorites: {
            connect: {
              id: propertyIdNumber,
            },
          },
        },
        include: {
          favorites: true,
        },
      });
      res.json(updatedTenant);
    }
    res.status(409).json({ message: "Property already exist as favorite" });
  } catch (error: any) {
    res
      .status(400)
      .json({ message: `Error adding to favorite ${error.message}` });
  }
};
export const removeFavoriteProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, propertyId } = req.params;
    const propertyIdNumber = Number(propertyId);
    const updatedTenant = await prisma.tenant.update({
      where: {
        cognitoId,
      },
      data: {
        favorites: {
          disconnect: {
            id: propertyIdNumber,
          },
        },
      },
      include: {
        favorites: true,
      },
    });
    res.json(updatedTenant);
  } catch (error: any) {
    res
      .status(400)
      .json({ message: `Error removing to favorite ${error.message}` });
  }
};

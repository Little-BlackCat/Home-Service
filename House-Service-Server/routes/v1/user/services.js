import { Router } from "express";
import { prisma } from "../../../lib/db.js";
import { Prisma } from "@prisma/client";

const router = new Router();

router.get("/autocomplete", async (req, res) => {
  try {
    const search = req.query.search || "";
    const result = await prisma.services.findMany({
      where: {
        service_name: {
          contains: search,
        },
      },
      take: 10,
      orderBy: {
        service_name: "asc",
      },
    });
    res.send({
      data: result,
    });
  } catch (error) {
    console.error(error);
  }
});

router.get("/", async (req, res) => {
  // #swagger.tags = ["User/Service"]
  // #swagger.summary = "Get all services"
  const search = req.query.search;
  const category = req.query.category;
  const sort = req.query.sort;
  const page = +req.query.page || 1;
  const minprice = +req.query.minprice || 0;
  const maxprice = +req.query.maxprice || 1000000;

  const PAGE_SIZE = +req.query.pageSize || 24;
  const skip = PAGE_SIZE * (page - 1);
  const searchQuery = `%${search}%`;

  try {
    let sorting =
      sort === "desc"
        ? Prisma.sql`service_name desc`
        : sort === `asc`
        ? Prisma.sql`service_name asc`
        : sort === `recommend asc`
        ? Prisma.sql`recommend asc`
        : sort === `popular`
        ? Prisma.sql`sum asc`
        : sort === "asc";
    let allServices = await prisma.$queryRaw`
    SELECT "Services".id,
        "Services".service_name,
        category_name as category,
        min as min_price,
        max as max_price,
        SUM,
        recommend,
        pic_service
    FROM "Services"
    LEFT JOIN "Categories" ON "Categories".id = "Services".category_id
    LEFT JOIN
      (SELECT service_id,min(price_per_unit),max(price_per_unit)
      FROM "Sub_services"
      GROUP BY service_id) minmax 
    ON minmax.service_id = "Services".id
    LEFT JOIN
      (SELECT "Services".id,sum(amount)
      FROM "Services"
      LEFT JOIN "Sub_services" ON "Sub_services".service_id = "Services".id
      LEFT JOIN "Service_Order" ON "Service_Order".sub_service_id = "Sub_services".id
      GROUP BY "Services".id) SUM 
    ON sum.id = "Services".id 
    WHERE (min between ${minprice} and ${maxprice} or max between ${minprice} and ${maxprice})
     ${category ? Prisma.sql` AND category_name=${category}` : Prisma.empty} 
     ${
       search
         ? Prisma.sql` AND service_name Ilike ${searchQuery}`
         : Prisma.empty
     } 
    ORDER By ${sorting}`;

    allServices = allServices.map((service) => ({
      ...service,
      sum: Number(service.sum),
    }));
    const allServicesPage = allServices.slice(
      PAGE_SIZE * (page - 1),
      PAGE_SIZE * page
    );
    const serviceCount = allServices.length;
    res.json({
      data: allServicesPage,
      pagination: {
        page,
        pageSize: PAGE_SIZE,
        totalRecord: serviceCount,
        totalPage: Math.ceil(serviceCount / PAGE_SIZE),
      },
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/maxprice", async (req, res) => {
  try {
    const search = req.query.search || "";
    const result = await prisma.sub_services.aggregate({
      _max: {
        price_per_unit: true,
      },
    });
    res.send({
      data: result._max.price_per_unit,
    });
  } catch (error) {
    console.error(error);
  }
});

export default router;

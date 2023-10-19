import { Router } from "express";
import { prisma } from "../../../lib/db.js";
const router = new Router();

router.get("/", async (req, res) => {
	// #swagger.tags = ["Admin/Service"]
	// #swagger.summary = "Get all services"
	const search = req.query.search;
	const category = req.query.category;
	const sort = req.query.sort;
	const price = +req.query.price;
	const page = +req.query.page || 1;

	const PAGE_SIZE = 5;
	const skip = PAGE_SIZE * (page - 1);

	try {
		const serviceCount = await prisma.services.count();
		const allServices = await prisma.services.findMany({
			// take: PAGE_SIZE,
			// skip: skip,
			where: {
				service_name: {
					contains: search, // ใช้ contains เพื่อให้คำค้นมีค่าเหมือน RegExp
				},
				category: {
					category_name: {
						contains: category,
					},
				},
			},
			include: {
				category: {
					select: {
						category_name: true,
						recommend: true,
					},
				},
			},
			orderBy: [
				{
					category: {
						recommend: "asc",
					},
				},
				{
					updateAt: "asc",
				},
				{
					service_name: 'asc',
				},
			],
		});
		// console.log(allServices);
		const listServices = allServices.map((service) => ({
			...service,
			category: service.category.category_name,
			recommend: service.category.recommend,
		}));

		res.json({
			data: listServices,
			totalServices: serviceCount,
		});
	} catch (error) {
		res.status(400).send(error);
	}
});

router.get("/:id", async (req, res) => {
	// #swagger.tags = ["Admin/Service"]
	// #swagger.summary = "Get service by id"
	const serviceId = Number(req.params.id);
	try {
		const service = await prisma.services.findUnique({
			where: {
				id: serviceId,
			},
			include: {
				category: {
					select: {
						category_name: true,
					},
				},
			},
		});

		const subservices = await prisma.sub_services.findMany({
			where: {
				service_id: serviceId,
			},
			orderBy: {
				price_per_unit: "asc"
			}
		});
		const serviceDetail = {
			...service,
			category: service.category.category_name,
			subServices: subservices,
		};

		res.json({
			data: serviceDetail,
		});
	} catch (error) {
		res.json({
			message: error,
		});
	}
});

router.delete("/:id", async (req, res) => {
	// #swagger.tags = ["Admin/Service"]
	// #swagger.summary = "Delete service by id"
	const serviceId = Number(req.params.id);
	try {
		const existServiceId = await prisma.services.findUnique({
			where: {
				id: serviceId,
			},
		});
		if (!existServiceId) {
			res.status(400).json({
				serviceId: null,
				message: `Not found serviceId: ${serviceId}`, 
			});
		} else {
			const subServicesToDelete = await prisma.sub_services.findMany({
				where: {
					service_id: Number(existServiceId.id), // ใช้ ID ของบริการ (service) ที่คุณต้องการลบ
				},
			});
			// console.log(subServicesToDelete)
			if (subServicesToDelete) {
				for (let subService of subServicesToDelete) {
					await prisma.sub_services.delete({
						where: {
							id: subService.id,
						},
					});
				}
			}
			await prisma.services.delete({
				where: {
					id: serviceId,
				},
			});
			res.json({
				message: `Delete category id:${serviceId} "${existServiceId}" successfull`,
			});
		}
	} catch (error) {
		res.json({
			message: error
		})
	}
});

router.post("/", async (req, res) => {
	// #swagger.tags = ["Admin/Service"]
	// #swagger.summary = "Create services"
	const { service_name, category_name, pic_service, items } = req.body;
	try {
		// 1. ค้นหาหมวดหมู่ด้วยชื่อ
		const category = await prisma.categories.findFirst({
			where: {
				category_name: category_name,
			},
		});
		// 2. ตรวจสอบว่าหมวดหมู่มีอยู่หรือไม่
		if (!category) {
			res.status(400).json({
				message: `Category '${category_name}' not found.`,
			});
		}

		const serviceResult = await prisma.services.findMany({
			where: {
				service_name: service_name,
			},
		});
		if (serviceResult.length > 0) {
			res.status(400).json({
				serviceResult: serviceResult,
				message: `${service_name} has been in database.`,
			});
		} else {
			const maxId = await prisma.services.aggregate({
				_max: {
					id: true,
				},
			});

			// console.log("Last service ID : ", maxId._max.id);
			await prisma.services.create({
				data: {
					id: maxId._max.id + 1, // ยังมีปัญหาตรงนี้ ต้องแก้มือก่อน
					service_name: service_name,
					category_id: category.id,
					pic_service: pic_service,
					createAt: new Date(
						new Date().getTime() - new Date().getTimezoneOffset() * 60000
					).toISOString(),
					updateAt: new Date(
						new Date().getTime() - new Date().getTimezoneOffset() * 60000
					).toISOString(),
				},
			});

			const serviceId = await prisma.services.findFirst({
				where: {
					service_name: service_name,
				},
			});
			if (!serviceId) {
				res.json({
					message: `Cannot find ${service_name}`,
				});
			}

			// console.log("service ID: ", serviceId);
			// console.log("Items", items);

			const maxSubServiceId = await prisma.sub_services.aggregate({
				_max: {
					id: true,
				},
			});

			const transformedData = items.map((item, index) => ({
				id: maxSubServiceId._max.id + 1 + index, // ยังมีปัญหาตรงนี้ ต้องแก้มือก่อน
				service_id: serviceId.id,
				sub_service_name: item.itemName,
				price_per_unit: parseFloat(item.itemPrice),
				unit: item.itemUnit,
			}));
			// console.log("หลังเพิ่มข้อมูล", transformedData);
			await prisma.sub_services.createMany({
				data: transformedData,
			});

			res.json({
				service_name,
				message: "create services success",
			});
		}
	} catch (error) {
		res.json({
			message: error
		})
	}
});

router.put("/", async (req, res) => {
	// #swagger.tags = ["Admin/Service"]
	// #swagger.summary = "Update services"
	const { id, service_name, category_name, pic_service, createAt, items } =
		req.body;
	try {
		// 1. ค้นหาหมวดหมู่ด้วยชื่อ
		const category = await prisma.categories.findFirst({
			where: {
				category_name: category_name,
			},
		});

		await prisma.services.update({
			where: {
				id: Number(id),
			},
			data: {
				service_name: service_name,
				category_id: Number(category.id),
				pic_service: pic_service,
				createAt: createAt,
				updateAt: new Date(
					new Date().getTime() - new Date().getTimezoneOffset() * 60000
				).toISOString(),
			},
		});

		
		const existingData = await prisma.sub_services.findMany({
			where: { service_id: Number(id) },
		});

		// console.log(`existingData:`, existingData)
		// console.log(`items:`, items)

		for (const item of existingData) {
			// ตรวจสอบว่ามีข้อมูลใหม่สำหรับอัพเดตหรือไม่
			const newData = items.find((newItem) => newItem.id === item.id);

			if (newData) {
				// มีข้อมูลใหม่สำหรับอัพเดต
				await prisma.sub_services.update({
					where: { id: item.id },
					data: {
						sub_service_name: newData.sub_service_name,
						price_per_unit: parseFloat(newData.price_per_unit),
						unit: newData.unit,
					},
				});
			} else {
				await prisma.sub_services.delete({
					where: {
						id: item.id
					}
				})
			}
			
		}

		const maxSubServiceId = await prisma.sub_services.aggregate({
			_max: {
				id: true,
			},
		});

		// วนลูปเพื่อเพิ่มข้อมูลใหม่
		for (const newDataItem of items) {
			if (
				!existingData.some((existingItem) => existingItem.id === newDataItem.id)
			) {
				// ไม่พบข้อมูลเดิมในฐานข้อมูล จึงเป็นข้อมูลใหม่
				await prisma.sub_services.create({
					data: {
						id: maxSubServiceId._max.id + 1,
						service_id: Number(id),
						sub_service_name: newDataItem.sub_service_name,
						price_per_unit: parseFloat(newDataItem.price_per_unit),
						unit: newDataItem.unit,
					},
				});
			}
		}

		res.json({
			service_name,
			message: "update services success",
		});
	} catch (error) {
		res.json({
			message: error
		})
	}
});

export default router;

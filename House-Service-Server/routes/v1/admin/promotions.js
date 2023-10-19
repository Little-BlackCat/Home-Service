import { Router } from "express";
import { prisma } from "../../../lib/db.js";
const router = new Router();

router.get("/", async (req, res) => {
	// #swagger.tags = ["Admin/Promotions"]
	// #swagger.summary = "Get all Promotion Code"
	const search = req.query.search;
	try {
		const promotions = await prisma.promotions.findMany({
			where: {
				promotion_code: {
					contains: search
				}
			},
			orderBy: {
				created_at: 'desc'
			}
		})
		// console.log(promotions)
		res.json({
			data: promotions
		})
	} catch (error) {
		res.json({
			message: error
		})
	}
})

router.get("/:id", async (req, res) => {
	// #swagger.tags = ["Admin/Promotions"]
	// #swagger.summary = "Get Promotion code by id"
	const promotionId = Number(req.params.id)
	try {
		const promotion = await prisma.promotions.findUnique({
			where: {
				promotion_id: promotionId
			}
		})

		res.json({
			data: promotion
		})
	} catch (error) {
		res.json({
			message: error
		})
	}
})

router.delete("/:id", async (req, res) => {
	// #swagger.tags = ["Admin/Promotions"]
	// #swagger.summary = "Delete Promotion Code by id"
	const promotionId = +(req.params.id)
	try {
		await prisma.promotions.delete({
			where: {
				promotion_id: promotionId
			}
		})

		res.json({
			message: `Delete promotion code: ${promotionId} success`
		})
	} catch (error) {
		res.json({
			message: error
		})
	}
})

router.post("/", async (req, res) => {
	// #swagger.tags = ["Admin/Promotions"]
	// #swagger.summary = "Create Promotion Code"
	const {promotion_code, type, quota, discount_amount, expired_time} = req.body
	const expiredTime = new Date(expired_time)
	
	try {
		const existPromotion = await prisma.promotions.findUnique({
			where: {
				promotion_code,
			}
		})
		if(existPromotion) {
			res.json({
				message: `Promotion Code : ${promotion_code} is already in database.`
			})
		} else {

			const maxPromotionCount = await prisma.promotions.aggregate({
				_max: {
					promotion_id: true
				}
			})
	
			await prisma.promotions.create({
				data: {
					promotion_id: maxPromotionCount._max.promotion_id + 1,
					promotion_code: promotion_code,
					type: type,
					quota: +(quota),
					discount_amount: +(discount_amount),
					created_at: new Date(
						new Date().getTime() - new Date().getTimezoneOffset() * 60000
					).toISOString(),
					updated_at: new Date(
						new Date().getTime() - new Date().getTimezoneOffset() * 60000
					).toISOString(),
					expired_time: new Date(expiredTime.getTime() - expiredTime.getTimezoneOffset() * 60000).toISOString(),
					use_count: 0,
				}
			})
		}
	} catch (error) {
		console.error(error)
		res.status(400).json({
			message: "Cannot Create Promotion"
		})
	}
})

router.put("/:id", async (req, res) => {
	// #swagger.tags = ["Admin/Promotions"]
	// #swagger.summary = "Update Promotion Code"
	const promotion_id = Number(req.params.id)
	const { promotion_code, type, quota, discount_amount, expired_time } = req.body
	try {
		const existPromotion = await prisma.promotions.findUnique({
			where: {
				promotion_id,
			}
		})
		if (!existPromotion) {
			res.json({
				message: `Cannot found promotion code id:${promotion_id}`
			})
		} else {
			const expiredTime = new Date(expired_time)
			await prisma.promotions.update({
				where: {
					promotion_id: promotion_id
				},
				data: {
					promotion_code: promotion_code,
					type: type,
					discount_amount: +(discount_amount),
					quota: +(quota),
					updated_at: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString(),
					expired_time: new Date(expiredTime.getTime() - expiredTime.getTimezoneOffset() * 60000).toISOString(), 
				}
			}) 
	 
			res.json({
				message: `Update promotion code id: ${promotion_id} success`
			})
		}

	} catch (error) {
		console.error(error) 
		res.status(400).json({
			message: error
		})
	}

})

export default router; 
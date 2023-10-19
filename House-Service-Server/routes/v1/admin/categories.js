import { Router } from "express";
import { prisma } from "../../../lib/db.js";
const router = new Router();

router.get("/", async (req, res) => {
	// #swagger.tags = ["Admin/Category"]
	// #swagger.summary = "Get all categories"
	const search = req.query.search;
	try {
		const allCategory = await prisma.categories.findMany({
			where: {
				category_name: {
					contains: search, // ใช้ contains เพื่อให้คำค้นมีค่าเหมือน RegExp
				},
			},
			orderBy: {
				recommend: 'asc'
			}
		});

		res.json({
			data: allCategory,
		});
	} catch (error) {
		console.error(error);
	}
});

router.get("/:id", async (req, res) => {
	// #swagger.tags = ["Admin/Category"]
	// #swagger.summary = "Get categories by id"
	const categoryId = Number(req.params.id);
	try {
		const category = await prisma.categories.findUnique({
			where: {
				id: categoryId,
			},
		});

		res.json({
			data: category,
		});
	} catch (error) {
		console.error(error);
	}
});

router.post("/", async (req, res) => {
	// #swagger.tags = ["Admin/Category"]
	// #swagger.summary = "Create categories"
	const { category_name } = req.body; // Extract the category_name from the request body
	try {
		// Ensure category_name is a string before passing it to prisma.categories.create()
		if (typeof category_name === "string") {
			const result = await prisma.categories.findMany({
				where: {
					category_name: category_name,
				},
			});
			if (result.length > 0) {
				res.status(400).json({
					result: result,
					message: `${category_name} has been in database.`,
				});
			} else {
				const maxRecomend = await prisma.categories.aggregate({
					_max: {
						recommend: true,
					},
				});
				const maxId = await prisma.categories.aggregate({
					_max: {
						id: true,
					}
				})
				await prisma.categories.create({
					data: {
						id: maxId._max.id + 1,
						category_name: category_name,
						createAt: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString(),
						updateAt: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString(),
						recommend: maxRecomend._max.recommend + 1,
					},
				});
				res.json({
					category_name,
					message: "create category success",
				});
			}
		} else {
			// Handle the case where category_name is not a string (e.g., provide an error response)
			res.status(400).json({
				message: "category_name must be a string",
			});
		}
	} catch (error) {
    res.status(500).json({
      message: error
    })
		console.error(error)
	}
});

router.delete("/:id", async (req, res) => {
	// #swagger.tags = ["Admin/Category"]
	// #swagger.summary = "Delete categories by id"
	const categoryId = Number(req.params.id);
	try {
		const existCategoryId = await prisma.categories.findUnique({
			where: {
				id: categoryId,
			},
		});
		if (!existCategoryId) {
			res.status(400).json({
				category_id: null,
				message: `Not found category_id: ${categoryId}`,
			});
		} else {
			await prisma.categories.delete({
				where: {
					id: categoryId,
				},
			});
      res.json({
        message: `Delete category id: ${categoryId} successfull`,
      });
		}
	} catch (error) {
    res.status(400).json({
      message: error
    })
		console.error(error)
	}
});

router.put("/:id", async (req, res) => {
	// #swagger.tags = ["Admin/Category"]
	// #swagger.summary = "Update categorie by id"
	const categoryId = Number(req.params.id);
  try { 
    const existCategoryId = await prisma.categories.findUnique({
      where: {
        id: categoryId,
			},
		});
    if (!existCategoryId) {
      res.status(400).json({
        category_id: null,
				message: `Not found category_id: ${categoryId}`,
			});
		} else {
      const currentTime = new Date(req.body.updateAt)
      await prisma.categories.update({
        where: {
          id: categoryId
        },
        data: {
          ...req.body,
          // แปลง Date กลับเป็น ISO-8601 DateTime โดยไม่เปลี่ยนเวลา
          updateAt: new Date(currentTime.getTime() - currentTime.getTimezoneOffset() * 60000).toISOString(),
        }
      })

      res.json({
        message: `Update category id: ${categoryId} successfull`,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error
    })
		console.error(error)
	}
});

router.put("/", async (req, res) => {
	// #swagger.tags = ["Admin/Category"]
	// #swagger.summary = "Update categorie by drag & drop"
	const { newPosition } = req.body
	try {
		for (const {id, position} of newPosition) {
			await prisma.categories.update({
				where: {id},
				data: {recommend: position},
			})
		}
    
		res.json({
			message: `Drag and drop update success`
		})
	} catch (error) {
    res.status(400).json({
      message: error
    })
		console.error(error)
	}
})


export default router;

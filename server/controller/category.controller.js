import { Category } from "../models/Category.model.js";
//create Tag handler function
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    console.log("hi from cata");
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Please fill the fields",
      });
    }
    //create entry in database
    const categorydetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(categorydetails);
    return res.status(201).json({
      success: true,
      message: "category Created Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//getAllTags
const showAllCategory = async (req, res) => {
  try {
    const allCategory = await Category.find(
      {},
      { name: true, description: true }
    );
    res.status(200).json({
      success: true,
      message: "All Category are returned successfully",
      allCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

 
const categoryPageDetails = async (req, res) => {
  try {
    //get category id

    const categoryId = req.body.categoryId;
    //get courses for specified categoryid
    const selectedCategory = await Category.findById({
      _id: categoryId,
    })
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .populate("ratingAndReview")
      .exec();
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }
    //get courses from different categories
    let differentCategory = null;
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec(); // $ne not equals
    //validation
     differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec();
    // get topselling courses
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: {
          path: "instructor,",
        },
      })
      .exec();
    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);
    console.log("most Selling Courses are", mostSellingCourses);
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
    //return
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { showAllCategory, createCategory, categoryPageDetails };

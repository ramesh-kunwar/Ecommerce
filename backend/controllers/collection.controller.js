import asyncHandler from "../services/asyncHandler.js";
import Collection from "../models/collection.schema.js";
import CustomError from "../utils/customError.js";
import mailHelper from "../utils/mailHelper.js";
import crypto from "crypto";

/************************************************************************
 * @Create_Collection
 * @route http://localhost:4000/api/collections
 * @description Create a collection or category of product
 * @params name
 * @method POST
 * @returns Collection object
 *************************************************************************/

export const createCollection = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new CustomError("Collection name is required", 400);
  }

  const collection = await Collection.create({
    name,
  });

  res.status(201).json({
    success: true,
    collection,
  });
});

/************************************************************************
 * @UPdate Collection
 * @route http://localhost:4000/api/collections/:id
 * @description Update a collection or category of product
 * @params name
 * @method PUT
 * @returns Collection object
 * **********************************************************************/

export const updateCollection = asyncHandler(async (req, res) => {
  // existing value to be updated
  const { id: collectionId } = req.params;

  // new value to get updated
  const { name } = req.body;

  if (!name) {
    throw new CustomError("Collection name is required", 400);
  }

  let updateCollection = await Collection.findByIdAndUpdate(
    collectionId,
    {
      name,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updateCollection) {
    throw new CustomError("Collection not found", 404);
  }

  res.status(200).json({
    success: true,
    updateCollection,
  });
});

/************************************************************************
 * @Delete Collection
 * @route http://localhost:4000/api/collections/:id
 * @description Delete a collection or category of product
 * @params id
 * @method DELETE
 * **********************************************************************/

export const deleteCollection = asyncHandler(async (req, res) => {
  const { id: collectionId } = req.params;

  if (!collectionId) {
    throw new CustomError("Collection id is required", 400);
  }

  const deletedCollection = await Collection.findByIdAndDelete(collectionId);

  if (!deletedCollection) {
    throw new CustomError("Collection not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Collection deleted successfully",
  });
});

/************************************************************************
 * @Get_All_Collection
 * @route http://localhost:4000/api/collections/:id
 * @description Get a collection or category of product
 * @params id
 * @method GET
 * **********************************************************************/

export const getAllCollection = asyncHandler(async (req, res) => {
  const collections = await Collection.find();

  res.status(200).json({
    success: true,
    collections,
  });
});

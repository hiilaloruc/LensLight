import Photo from "../models/photoModel.js";
//create new photoBox object

const createPhoto = async (req, res) => {
  try {
    console.log("Request Body: ", req.body);
    const photo = await Photo.create(req.body);
    res.status(201).json({
      succeeded: true,
      photo,
    });
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
};
const getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({});
    res.status(201).json({
      succeeded: true,
      photos,
    });
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
};

export { createPhoto, getAllPhotos };

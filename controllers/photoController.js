import Photo from "../models/photoModel.js";
//create new photoBox object
const createPhoto = (req, res) => {
  const photo = Photo.create(req.body);
  res.status(201).json({
    succeeded: true,
    photo,
  });
};

export { createPhoto };

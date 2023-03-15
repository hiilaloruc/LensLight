import Photo from "../models/photoModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

//create new photoBox object

const createPhoto = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "lenslight",
    }
  );

  try {
    console.log("Request Body: ", req.body);
    await Photo.create({
      name: req.body.name,
      description: req.body.description,
      user: res.locals.user._id,
      url: result.secure_url,
      image_id: result.public_id,
    });

    fs.unlinkSync(req.files.image.tempFilePath); //delete img from project->temp folder
    res.status(201).redirect("/users/dashboard");
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
};
const getAllPhotos = async (req, res) => {
  try {
    const photos = res.locals.user
      ? await Photo.find({ user: { $ne: res.locals.user._id } })
      : await Photo.find({});
    res.status(200).render("photos", {
      photos,
      link: "photos",
    });
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
};
const getAPhoto = async (req, res) => {
  try {
    const photo = await Photo.findById({ _id: req.params.id }).populate("user");

    let isOwner = false;
    if (res.locals.user) {
      isOwner = photo.user.equals(res.locals.user._id);
    }

    res.status(200).render("photo", {
      photo,
      link: "photos",
      isOwner,
    });
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
};

const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    const photoId = photo.image_id; //public_id in cloudinary
    await cloudinary.uploader.destroy(photoId); //delete from cloudinary
    await Photo.findByIdAndRemove({ _id: req.params.id });
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
};

const updatePhoto = async (req, res) => {
  console.log("REQUEST PARAMS: ", req.params);
  console.log("REQUEST BODY: ", req.body);
  try {
    const photo = await Photo.findById(req.params.id);

    //if new photo selected
    if (req.files) {
      const photoId = photo.image_id; //public_id in cloudinary
      await cloudinary.uploader.destroy(photoId); //delete from cloudinary

      const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
          use_filename: true,
          folder: "lenslight",
        }
      );
      photo.url = result.secure_url;
      photo.image_id = result.public_id;
      fs.unlinkSync(req.files.image.tempFilePath); //delete img from project->temp folder
    }
    photo.name = req.body.name;
    photo.description = req.body.description;
    photo.save();

    res.status(200).redirect(`/photos/${req.params.id}`);
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
};

export { createPhoto, getAllPhotos, getAPhoto, deletePhoto, updatePhoto };

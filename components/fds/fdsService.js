const FD = require("../../models/fds");
const cloudinary = require('../../utils/cloudinary')

const query = (filter = {}) => FD.find(filter).lean();

const save = async (req) => {
    const image = await cloudinary.uploader.upload(req.file.path, { folder: 'fdshop' });

    const {name} = req.body;
    const {price} = req.body;
    const {discount} = req.body;
    const {description} = req.body;

    const newFD = new FD({
        name: name,
        release_date: Date.now(),
        is_best: req.body.is_best ? true : false,
        is_drink: req.body.is_drink ? true : false,
        price: price,
        discount: discount,
        description: description,
        avatar: image.secure_url,
        cloudinary_id: image.public_id
    });

    return await newFD.save();
};

module.exports = {
    query,
    save
}
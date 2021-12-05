const FD = require("../../models/fds");
const cloudinary = require('../../utils/cloudinary')

const query = (filter = {}) => FD.find(filter).lean();

const queryOne = (filter = {}) => FD.findOne(filter).lean();

const queryFor = (skip, limit) => FD.find().skip(skip).limit(limit).lean();

const deleteOne = (filter = {}) => FD.deleteOne(filter);

const count = (filter = {}) => FD.countDocuments(filter);

const save = async (req) => {
    const image = await cloudinary.uploader.upload(req.file.path, { folder: 'fdshop/fds' });

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

    await newFD.save();

    return image.public_id;
};

const updateOne = async (req, id) => {
    const filter = { _id: id }

    if(req.file) {
        const image = await cloudinary.uploader.upload(req.file.path, { folder: 'fdshop/fds' });

        const {name} = req.body;
        const {price} = req.body;
        const {discount} = req.body;
        const {description} = req.body;

        const updateDoc = { $set: {
            name: name,
            is_best: req.body.is_best ? true : false,
            is_drink: req.body.is_drink ? true : false,
            price: price,
            discount: discount,
            description: description,
            avatar: image.secure_url,
            cloudinary_id: image.public_id
        }}

        await FD.updateOne(filter, updateDoc);
    } else {
        const {name} = req.body;
        const {price} = req.body;
        const {discount} = req.body;
        const {description} = req.body;

        const updateDoc = { $set: {
            name: name,
            is_best: req.body.is_best ? true : false,
            is_drink: req.body.is_drink ? true : false,
            price: price,
            discount: discount,
            description: description
        }}

        await FD.updateOne(filter, updateDoc);
    }
};

module.exports = {
    query,
    queryOne,
    queryFor,
    save,
    updateOne,
    deleteOne,
    count
}
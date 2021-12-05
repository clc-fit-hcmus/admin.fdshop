const {query, queryFor, updateOne, deleteOne, queryOne, save, count} = require("./fdsService");

// get FDs from DB
const getFDs = async (req, res) => {
    try {
        const perPage = 2;
        const maxPage = Math.ceil((await count()) / perPage);
        const page = ((t = (req.query.page || 1)) <= maxPage) && (t > 0) ? t : 1;
        
        const fds = await queryFor((perPage * page) - perPage, perPage);

        res.render('apps.shop/product-list', {
            fds,
            current: page,
            is_overload: page >= maxPage,
            is_notOne: maxPage > 1,
            pages: maxPage,
            next: parseInt(page) + 1,
            prev: (c = parseInt(page) - 1) ? c : 0
          });
    } catch (error) {
        res.status(409).json({success: false, data: [], error: error});
    }
};

//get FDs from DB with name
const getFD = async (req, res) => {
    try {
        const id = req.params.id;
        const fd = (t = await queryOne({ cloudinary_id : { $regex: id} })) ? t : await queryOne({ _id: id });
        
        res.render('apps.shop/product-details', { fd });
    } catch (error) {
        res.status(409).json({success: false, data: [], error: error});
    }
};

const getToUpdate = async (req, res) => {
    try {
        const id = req.params.id;
        const fd = await queryOne({ _id: id });
        res.render('crud/update-fd', { fd });
    } catch (error) {
        res.status(409).json({success: false, data: [], error: error});
    }
};

const postFD = async (req, res) => {
    try {
        const id = await save(req);
        const split = id.split('/');
        res.redirect(`/product-details/${split[split.length - 1]}`);
    } catch (error) {
        res.status(409).json({success: false, data: [], error: error});
    }
};

const updateFD = async (req, res) => {
    try {
        const id = req.params.id;
        await updateOne(req, id);
        res.redirect(`/product-details/${id}`);
    } catch (error) {
        res.status(409).json({success: false, data: [], error: error});
    }
};

const deleteFD = async (req, res) => {
    try {
        const id = req.params.id;
        await deleteOne({ _id: id });
        res.redirect("/product-list");
    } catch (error) {
        res.status(409).json({success: false, data: [], error: error});
    }
};

module.exports = {
    postFD,
    updateFD,
    deleteFD,
    getFDs,
    getToUpdate,
    getFD
}
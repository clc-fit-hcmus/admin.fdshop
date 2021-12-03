const {query, save} = require("./fdsService");

// get FDs from DB
const getFDs = async (req, res) => {
    const fds = await query();
    res.render('apps.shop/product-list', { fds });
};

//get FDs from DB with name
const getFD = async (req, res) => {
    const fdname = req.params.fdname;
    try {
        const fds = await query({phone_number: fdname});
        res.status(200).json({success: true, data: fds});
    } catch (error) {
        res.status(409).json({success: false, data: [], error: error});
    }
};

const postFD = async (req, res) => {
    try {
        await save(req);
        res.redirect('/product-details');
    } catch (error) {
        res.status(409).json({success: false, data: [], error: error});
    }
};

module.exports = {
    postFD,
    getFDs,
    getFD
}
const { query, queryOne, update } = require("./personsService");

// get Persons from DB
const getPersons = async (req, res) => {
    try {
        const persons = await query({ $or: [ { 'login.role': 'employee' }, { 'login.role': 'admin' } ]});
        res.render('staffs/list', { persons });
    } catch (error) {
        res.status(409).json({success: false, data: [], error: error});
    }
}

const updateProfile = async (req, res) => {
    try {
        await update(req);
        res.redirect('/profile');
    } catch (error) {
        console.log(error);
        res.status(409).json({success: false, data: [], error: error});
    }
}

module.exports = {
    getPersons,
    updateProfile
}
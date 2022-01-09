const { queryFor, count, findByIdAndUpdate } = require("./personsService");

// get Persons from DB
const getPersons = async (req, res) => {
    try {
        const errorMessages = req.flash('error');
        const successMessages = req.flash('success');

        const role = req.query.role;

        let filter = {}
        let currentRole = "";
        if (role == "admin") {
            filter = { "login.role": "admin" };
            currentRole = "&role=admin";
        } else if (role == "staff") {
            filter = { "login.role": "staff" };
            currentRole = "&role=staff";
        } else if (role == "customer") {
            filter = { "login.role": "customer" };
            currentRole = "&role=customer";
        }

        const perPage = 10;
        const maxPage = Math.ceil((await count(filter)) / perPage);
        const page = ((t = (req.query.page || 1)) <= maxPage) && (t > 0) ? t : 1;
        
        const persons = await queryFor((perPage * page) - perPage, perPage, filter);

        res.render('persons/list', {
            persons,
            current: page,
            is_overload: page >= maxPage,
            is_notOne: maxPage > 1,
            pages: maxPage,
            next: parseInt(page) + 1,
            prev: (c = parseInt(page) - 1) ? c : 0,
            currentRole: currentRole,
            errorMessages: errorMessages, 
            hasErrors: errorMessages.length > 0,
            successMessages: successMessages, 
            success: successMessages.length > 0
          });
    } catch (error) {
        res.status(409).json({success: false, data: [], error: error});
    }
}

module.exports = {
    getPersons
}
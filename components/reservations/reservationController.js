const {query, queryFor, deleteOne, queryOne, count} = require("./reservationService");

// get FDs from DB
const getReservations = async (req, res) => {
    try {
        const errorMessages = req.flash('error');
        const successMessages = req.flash('success');

        const accept = req.query.accept;

        let filter = {}
        let currentStatus = "";
        if (accept == "-1") {
            filter = { "accept": -1 };
            currentStatus = "&accept=-1";
        } else if (accept == "0") {
            filter = { "accept": 0 };
            currentStatus = "&accept=0";
        } else if (accept == "1") {
            filter = { "accept": 1 };
            currentStatus = "&accept=1";
        }

        const perPage = 10;
        const maxPage = Math.ceil((await count(filter)) / perPage);
        const page = ((t = (req.query.page || 1)) <= maxPage) && (t > 0) ? t : 1;
        
        const reservations = await queryFor((perPage * page) - perPage, perPage, filter);

        res.render('reservations/reservation-list', {
            reservations,
            current: page,
            is_overload: page >= maxPage,
            is_notOne: maxPage > 1,
            pages: maxPage,
            next: parseInt(page) + 1,
            prev: (c = parseInt(page) - 1) ? c : 0,
            currentStatus: currentStatus,
            errorMessages: errorMessages, 
            hasErrors: errorMessages.length > 0,
            successMessages: successMessages, 
            success: successMessages.length > 0
          });
    } catch (error) {
        res.status(409).json({success: false, data: [], error: error});
    }
};

module.exports = {
    getReservations
}
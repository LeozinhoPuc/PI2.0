searchView = (req,res) =>{
    res.render('search');
}


bookingView = (req,res) =>{
    res.render('booking');
}


payView = (req,res) =>{
    res.render('pay');
}

flightsView = (req,res) =>{
    res.render('flights');
}
module.exports = {
    searchView,
    bookingView,
    payView,
    flightsView
}
function getStatus(req, res, next){
        res.status(200).json(
        {server: "Live and listening..."})     
}


module.exports = { getStatus };
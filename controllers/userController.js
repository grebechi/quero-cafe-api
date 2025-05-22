async function getMe(req, res) {
    res.json({
        id: req.user.id,
        isAdmin: req.user.isAdmin,
        isTrainee: req.user.isTrainee
    });
}

module.exports = { getMe };

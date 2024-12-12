let controller = {};

controller.renderSearch = async (req, res) => {
    res.render('search', {
        title: "Search • Simple Threads",
        isSearch: true,
        loggedIn: true,
    });
}

module.exports = controller;
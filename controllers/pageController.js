const getIndexPage = (req, res) => {
  res.render("index", {
    link: "index",
  }); //renders the file according to url
};

const getAboutPage = (req, res) => {
  res.render("about", {
    link: "about",
  }); //renders the file according to url
};
const getRegisterPage = (req, res) => {
  res.render("register", {
    link: "register",
  }); //renders the file according to url
};

export { getIndexPage, getAboutPage, getRegisterPage };

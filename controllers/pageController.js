const getIndexPage = (req, res) => {
  res.render("index"); //renders the file according to url
};

const getAboutPage = (req, res) => {
  res.render("about"); //renders the file according to url
};

export { getIndexPage, getAboutPage };

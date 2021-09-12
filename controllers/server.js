exports.get = async (req, res, next) => {
    try {
      return res.status(200).send({ error: false, message: "Server active"});
    } catch (error) {
      return res.status(500).send({ error: true, message: "Database operation failed" }); 
    } 
  }
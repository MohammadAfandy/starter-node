const calendarService = appRequire("services", "calendar");

exports.calendarGenerate = async (req, res, next) => {
  try {
    let { year, dayoff = 0, force = 0 } = req.body;
    await calendarService.generate({ req, year, dayoff, force });

    res.success("Success");

  } catch (error) {
    next(error);
  }
};

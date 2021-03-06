const BaseRepository = appRequire("repositories");

class CalendarRepository extends BaseRepository {
  constructor(request) {
    super(request, "calendar");
  }
}

module.exports = (req) => {
  return (new CalendarRepository(req));
}

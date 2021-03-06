const calendarRepo = appRequire("repositories", "calendar");
const Api = appRequire("utils", "api");
const baseUrl = 'https://www.googleapis.com/calendar/v3/calendars';
const helper = appRequire("utils", "helpers");

const apiCalendar = new Api(baseUrl, {
  headers: {
    'Content-Type': 'application/json'
  },
  params: {
    key: 'AIzaSyAq-QCpBAUTV5WBCqnJT2onpU8ZRswqoMo',
  }
});

const getHolidays = (year, lang = 'id.indonesian') => new Promise(async (resolve, reject) => {
  try {
    const apiCall = await apiCalendar.get(lang + '%23holiday%40group.v.calendar.google.com/events', {
      params: {
        year,
      }
    });
  
    if (apiCall.status == 200) {
      resolve(apiCall.data.items);
    } else {
      reject('Failed get holiday data');
    }
  } catch (error) {
    reject(error);
  }
});

const generate = ({ req, year, dayoff = false, force = false }) => new Promise(async (resolve, reject) => {
  try {
    if (!force) {
      // check is year alrady exist
      const check = await calendarRepo(req).findOne({
        where: {
          year: year
        }
      })
      if (check) throw new ValidationError(`Year ${year} already exist`);
    }

    // generate 1 year calendar
    const start_date = year + '-01-01';
    const end_date = year + '-12-31';
    let arrDates = helper.date.rangeDate(start_date, end_date);

    // insert all date to model calendar
    const weekend = ['Saturday', 'Sunday'];
    let calendarData = arrDates.map((v) => ({
      date: v.date,
      day_name: v.dayName,
      day: v.day,
      month: v.month,
      year: v.year,
      is_dayoff: weekend.includes(v.dayName) ? 1 : 0,
    }));
    await calendarRepo(req).bulkCreate({
      data: calendarData,
      updateOnDuplicate: ['type'],
    });

    // update dayoff
    if (dayoff) {
      let holidays = await getHolidays(year);
  
      let promises = [];
      // filter year
      holidays = holidays.filter((v) => v.start.date.substring(0, 4) == year);
      for (let holiday of holidays) {
        const holidayDate = holiday.start.date;
        const description = holiday.summary || '';
        const type = description.toLowerCase().includes('cuti') ? 'leave' : 'holiday';
        const updateHoliday = calendarRepo(req).update({
          data: {
            type,
            description,
            is_dayoff: 1,
          },
          where: {
            date: holidayDate,
          }
        });
        promises.push(updateHoliday);
      }
  
      await Promise.all(promises);
    }

    resolve("Success generate");
  } catch (error) {
    reject(error);
  }
});

const isDayOff = async (date = new Date()) => {
  const check = await calendarRepo().findOne({
    where: {
      date: moment(date).format('YYYY-MM-DD'),
    }
  });
  if (!check) {
    throw new Error("Invalid Date Parameter");
  }

  return !!check.is_dayoff;
}

exports.getHolidays = getHolidays;
exports.generate = generate;
exports.isDayOff = isDayOff;

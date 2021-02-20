const BaseRepository = appRequire("repositories");
const stringLib = appRequire("libs", "string");
const { Op } = require("sequelize"); 

class UserRepository extends BaseRepository {
  constructor(request) {
    super(request, "user");
  }

  async validate(newData, previousData = {}) {

    // check for duplicate
    let checkDuplicate = await this.checkDuplicate({
      username: newData.username,
      email: newData.email,
      phone_number: newData.phone_number,
    }, previousData.id);

    if (checkDuplicate.length) {
      throw new ValidationError("Validation Error", checkDuplicate.map(v => {
        return { param: v , msg: `${stringLib.ucfirst(v, "_")} already taken`, value: newData[v] };
      }));
    }

    return true;
  }

  async findCredential(credential) {
    let data = await this.findOne({
      where: {
        [Op.or]: [
          { username: credential },
          { email: credential },
        ],
      },
      include: [{
        model: 'role',
      }]
    });

    return data;
  }

  async checkDuplicate(columns, excluded_id = 0) {
    let res = [];
    let promises = [];
    let mapColumns = Object.keys(columns);
    for (let key in columns) {
      promises.push(this.count({
        where: {
          [key]: columns[key],
          id: {
            [Op.ne]: excluded_id,
          },
        } 
      }));
    }
    let data = await Promise.all(promises);
    data.forEach((v, index) => {
      if (v > 0) res.push(mapColumns[index]);
    });
    return res;
  }
}

module.exports = UserRepository;
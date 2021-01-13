const BaseRepository = appRequire("repositories");
const { Op } = require("sequelize"); 

class UserRepository extends BaseRepository {
  constructor(request) {
    super(request, "user");
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

  async checkDuplicate(columns) {
    let res = [];
    let promises = [];
    let mapColumns = Object.keys(columns);
    for (let key in columns) {
      promises.push(this.count({ where: { [key]: columns[key] } }));
    }
    let data = await Promise.all(promises);
    data.forEach((v, index) => {
      if (v > 0) res.push(mapColumns[index]);
    });
    return res;
  }
}

module.exports = UserRepository;
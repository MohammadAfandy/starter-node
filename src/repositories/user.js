const BaseRepository = appRequire("repositories");
const helper = appRequire("utils", "helpers");
const { Op } = require("sequelize"); 

class UserRepository extends BaseRepository {
  constructor(request) {
    super(request, "user");
  }
  async getAll({
    search,
    page,
    limit,
    sort,
  }) {
    const columns = [
      ['u.id', 'id'],
      ['u.fullname', 'fullname'],
      ['u.username', 'username'],
      ['GROUP_CONCAT(r.id)', 'role_id'],
      ['GROUP_CONCAT(r.role_name)', 'role_name'],
      ['u.email', 'email'],
      ['u.phone_number', 'phone_number'],
      ['u.created_at', 'created_at'],
    ];
    const query =  `
      SELECT {{columns}}
      FROM users u
      LEFT JOIN user_role ur ON u.id = ur.user_id
      LEFT JOIN role r ON ur.role_id = r.id
      WHERE u.deleted_at IS NULL
      GROUP BY u.id
    `;

    const data = await this.generateQuery({ columns, query, search, page, limit, sort });
    
    return data;
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
        return { param: v , msg: `${helper.string.ucfirst(v, "_")} already taken` };
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

module.exports = (req) => {
  return (new UserRepository(req));
};

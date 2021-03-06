const { Op, QueryTypes, Utils } = require("sequelize");
const { sequelize } = appRequire("models");

class BaseRepository {
  constructor(request, model) {
    this.request = request;
    this.model = appRequire("models")[model];

    this.data = {};
    this.bulkData = [];
    this.where = {};
    this.include = [];
    this.trash = false;
    this.options = {
      nest: true,
    };
  }

  get primaryKey() {
    return this.model.primaryKeyAttributes;
  }

  get attributes() {
    return Object.keys(this.model.rawAttributes);
  }

  get selectAttributes() {
    return {
      where: this.where,
      include: this.include,
    }
  }

  get associations() {
    return this.model.associations;
  }

  hasRelation(modelName) {
    let result = !!this.associations[modelName];
    if (!result) {
      result = !!this.associations[Utils.pluralize(modelName)];
    }
    return result;
  }

  hasAttribute(attribute) {
    return this.attributes.indexOf(attribute) > -1;
  }

  setData(data, isNewRecord = false) {
    this.data = data || {};

    // set created by and updated by
    if (this.request && this.request.user) {
      if (this.hasAttribute("created_by") && isNewRecord) {
        this.data.created_by = this.request.user.id;
      }
  
      if (this.hasAttribute("updated_by") && !isNewRecord) {
        this.data.updated_by = this.request.user.id;
      }
    }
  }

  setBulkData(bulkData) {
    this.bulkData = bulkData || [];

    if (this.request && this.request.user) {
      if (this.hasAttribute("created_by")) {
        this.bulkData = this.bulkData.map((v) => ({
          ...v,
          created_by: this.request.user.id,
        }));
      }
    }
  }

  setWhere(where) {
    this.where = where;
  }

  setInclude(include) {
    for (let i in include) {
      let value = {};
      Object.assign(value, include[i]);
      value.model = appRequire("models")[include[i].model];
      include[i] = value;
      if ('include' in include[i]) {
        this.setInclude(include[i].include);
      }
    }

    this.include = include;
  }

  setOptions(options) {
    this.options = { ...this.options, ...options };
  }

  setAllAttributes({
    where,
    include,
    ...options
  }) {
    this.setWhere(where);
    this.setInclude(include);
    this.setOptions({ ...options });
  }

  async findByPk({ id, ...rest }) {
    this.setAllAttributes(rest);
    let process = await this.model.findByPk(id, {
      ...this.selectAttributes,
      ...this.options
    });
    return process;
  }

  async findOne({ ...rest } = {}) {
    this.setAllAttributes({ ...rest });
    let process = await this.model.findOne({ ...this.selectAttributes, ...this.options });
    return process;
  }

  async count({ ...rest } = {}) {
    this.setAllAttributes({ ...rest });
    let process = await this.model.count({ ...this.selectAttributes, ...this.options });
    return process;
  }

  async findAll({ ...rest } = {}) {
    this.setAllAttributes({ ...rest });
    let process = await this.model.findAll({ ...this.selectAttributes, ...this.options });
    return process;
  }

  async create({ data, ...rest }) {
    this.setAllAttributes({ ...rest });
    this.setData(data, true);
    let process = await this.model.create(this.data, {
      individualHooks: true,
      ...this.options,
    });
    return process;
  }

  async bulkCreate({ data, ...rest }) {
    this.setBulkData(data);
    this.setAllAttributes({ ...rest });
    let process = await this.model.bulkCreate(this.bulkData, {
      // individualHooks: true,
      ...this.options,
    });
    return process;
  }

  async update({ data, ...rest }) {
    this.setData(data);
    this.setAllAttributes(rest);
    let process = await this.model.update(this.data, {
      where: this.where,
      individualHooks: true,
      ...this.options,
    });
    return process;
  }

  async destroy({ ...rest }) {
    this.setAllAttributes(rest);
    let process = await this.model.destroy({
      where: this.where,
      individualHooks: true,
      ...this.options,
    })
    return process;
  }

  async truncate({ ...rest }) {
    this.setAllAttributes(rest);
    let process = await this.model.destroy({
      truncate: true,
      ...this.options,
    });
    return process;
  }

  async upsert({ data, ...rest }) {
    this.setData(data, true);
    this.setAllAttributes(rest);
    let process = await this.model.upsert(this.data, {
      individualHooks: true,
      ...this.options,
    });
    return process;
  }

  async firstAndUpdate({ data, where, ...rest }) {
    const instance = await this.findOne({ where, ...rest });
    if (!instance) {
      throw new NotFoundError(this.model.name + " Not Found");
    }
    await this.update({
      data,
      where,
      ...rest,
    });
    return instance.reload();
  }

  async firstAndDestroy({ where, ...rest }) {
    const instance = await this.findOne({ where, ...rest });
    if (!instance) {
      throw new NotFoundError(this.model.name + " Not Found");
    }
    await this.destroy({
      where,
      ...rest,
    });
    return instance;
  }

  async selectRaw({ query, ...rest }) {
    this.setAllAttributes(rest);
    let process = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      ...this.options,
    });
    return process;
  }

  async generateQuery({
    columns,
    query: baseQuery,
    search,
    page = 0,
    limit = 20,
    sort,
  }) {
    let addQuery = "";
    let replacements = [];
    let condition = "";
    let select = columns.map(v => {
      if (isArray(v)) return `${v[0]} AS ${v[1]}`;
      return v;
    }).join(", ");

    baseQuery = baseQuery.replace("{{columns}}", select);

    if (search) {
      condition = columns.map(v => {
        let col = isArray(v) ? v[1] : v;
        return `${col} LIKE ?`;
      }).join(" OR ");
      addQuery += `WHERE (${condition}) `;
      replacements = Array(columns.length).fill("%" + search + "%");
    }

    if (sort) {
      sort = sort.split(":");
      addQuery += `ORDER BY ${sort[0]} ${sort[1]} `;
    }

    let queryCount = `SELECT COUNT(*) AS total FROM (${baseQuery}) src ${addQuery}`;
    addQuery += `LIMIT ${page * limit}, ${limit}`;
    let queryData = `SELECT * FROM (${baseQuery}) src ${addQuery}`;

    let [data, { total }] = await Promise.all([
      this.selectRaw({ query: queryData, replacements }),
      this.selectRaw({ query: queryCount, replacements, plain: true }),
    ]);

    return {
      data,
      total,
      totalPage: Math.ceil(total / limit),
    }
  }

}

module.exports = BaseRepository;

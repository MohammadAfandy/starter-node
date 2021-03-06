const NodeCache = require('node-cache');
const allowedOriginRepo = appRequire("repositories", "allowed_origin");
const userRepo = appRequire("repositories", "user");

class MyCache extends NodeCache {  
  async init() {
    await this.setAllowedOrigin();
    await this.setRolePermission();
  }

  list() {
    let data = [];
    for (let key of this.keys()) {
      data.push({
        key: key,
        val: this.get(key),
        ttl: this.getTtl(key),
      });
    }

    return data;
  }

  async setAllowedOrigin() {
    const allowedOrigin = await allowedOriginRepo().findAll();
    this.set("allowed_origin", allowedOrigin.map((v) => v.origin));
  }

  async setRolePermission() {
    const users = await userRepo().findAll({
      attributes: ['id', 'username'],
      include: [{
        model: "role",
        attributes: ["role_name"],
        through: { attributes: [] },
        include: [{
          model: "permission",
          attributes: ["permission"],          
          through: { attributes: [] },
        }]
      }],
    });

    let rolePermission = {};
    for (let user of users) {
      if (!rolePermission[user.id]) {
        rolePermission[user.id] = {
          roles: [],
          permissions: [],
        };
      }
      let roles = new Set();
      let permissions = new Set();
      for (let role of user.roles) {
        roles.add(role.role_name);
        for (let perm of role.permissions) {
          permissions.add(perm.permission);
        }
      }
      rolePermission[user.id].roles = [...roles];
      rolePermission[user.id].permissions = [...permissions];
    }
    this.set("role_permission", rolePermission);
  }
};

const myCache = new MyCache();

module.exports = myCache;

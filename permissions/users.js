const AccessControl = require('role-acl');
const ac = new AccessControl();

//---------------------------------------------
// Grant user-role permission on DB users resource

ac
  .grant('user')
  .condition({Fn:'EQUALS', args: {'requester':'$.owner'}})
  .execute('read')
  .on('user', ['*', '!password', '!passwordSalt']);

ac
  .grant('user')
  .condition({Fn:'EQUALS', args: {'requester':'$.owner'}})
  .execute('update')
  .on('user', ['firstName', 'lastName', 'about', 'password', 'email', 'avatarURL']);

//---------------------------------------------
// Grant employee-role permission on DB users resource

ac
  .grant('employee')
  .condition({Fn:'EQUALS', args: {'requester':'$.owner'}})
  .execute('read')
  .on('employee', ['*', '!password', '!passwordSalt']);

ac
  .grant('employee')
  .condition({Fn:'EQUALS', args: {'requester':'$.owner'}})
  .execute('update')
  .on('employee', ['firstName', 'lastName', 'about', 'password', 'email', 'avatarURL']);

//---------------------------------------------
//Grant admin-role permission on DB users resource
ac
  .grant('admin')
  .execute('read')
  .on('user');
ac
  .grant('admin')
  .execute('read')
  .on('employee');

ac
  .grant('admin')
  .execute('read')
  .on('users');
ac
  .grant('admin')
  .execute('read')
  .on('employees');

ac
  .grant('admin')
  .execute('update')
  .on('user');
ac
  .grant('admin')
  .execute('update')
  .on('employee');

ac
  .grant('admin')
  .condition({Fn:'NOT_EQUALS', args: {'requester':'$.owner'}})
  .execute('delete')
  .on('user');

ac
  .grant('admin')
  .condition({Fn:'NOT_EQUALS', args: {'requester':'$.owner'}})
  .execute('delete')
  .on('employee');

//---------------------------------------------
//Exports method for admin
exports.readAll = (requester) => {
  return ac
    .can(requester.role)
    .execute('read')
    .sync()
    .on('users','employees');
}

//---------------------------------------------
//Exports method for employee checking permissions
exports.empRead = (requester, data) => {
  return ac
    .can(requester.role)
    .context({requester:requester.ID, owner:data.ID})
    .execute('read')
    .sync()
    .on('employee');
}

exports.empUpdate = (requester, data) => {
  return ac
    .can(requester.role)
    .context({requester:requester.ID, owner:data.ID})
    .execute('update')
    .sync()
    .on('employee');
}

exports.empDelete = (requester, data) => {
  return ac
    .can(requester.role)
    .context({requester:requester.ID, owner:data.ID})
    .execute('delete')
    .sync()
    .on('employee');
}

//---------------------------------------------
//Exports method for user checking permissions

exports.userRead = (requester, data) => {
  return ac
    .can(requester.role)
    .context({requester:requester.ID, owner:data.ID})
    .execute('read')
    .sync()
    .on('user');
}

exports.userUpdate = (requester, data) => {
  return ac
    .can(requester.role)
    .context({requester:requester.ID, owner:data.ID})
    .execute('update')
    .sync()
    .on('user');
}

exports.userDelete = (requester, data) => {
  return ac
    .can(requester.role)
    .context({requester:requester.ID, owner:data.ID})
    .execute('delete')
    .sync()
    .on('user');
}

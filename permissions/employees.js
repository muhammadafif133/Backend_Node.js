const AccessControl = require('role-acl');
const ac = new AccessControl();

//---------------------------------------------
// Grant employee-role permission on DB employee resource

ac
  .grant('employee')
  .condition({Fn:'EQUALS', args: {'requester':'$.owner'}})
  .execute('read')
  .on('employee', ['*', '!password', '!passwordSalt']);

ac
  .grant('employee')
  .condition({Fn:'EQUALS', args: {'requester':'$.owner'}})
  .execute('update')
  .on('employee', ['firstName', 'lastName', 'password', 'email', 'avatarURL']);


//Grant admin-role permission on DB employee resource
ac
  .grant('admin')
  .execute('read')
  .on('employee');

ac
  .grant('admin')
  .execute('read')
  .on('employees');

ac
  .grant('admin')
  .execute('update')
  .on('employee');

ac
  .grant('admin')
  .condition({Fn:'NOT_EQUALS', args: {'requester':'$.owner'}})
  .execute('delete')
  .on('employee');

//Exports methods for checking permissions
exports.readAll = (requester) => {
  return ac
    .can(requester.role)
    .execute('read')
    .sync()
    .on('employees');
}

exports.read = (requester, data) => {
  return ac
    .can(requester.role)
    .context({requester:requester.ID, owner:data.ID})
    .execute('read')
    .sync()
    .on('employee');
}

exports.update = (requester, data) => {
  return ac
    .can(requester.role)
    .context({requester:requester.ID, owner:data.ID})
    .execute('update')
    .sync()
    .on('employee');
}

exports.delete = (requester, data) => {
  return ac
    .can(requester.role)
    .context({requester:requester.ID, owner:data.ID})
    .execute('delete')
    .sync()
    .on('employee');
}
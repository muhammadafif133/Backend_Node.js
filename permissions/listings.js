const AccessControl = require('role-acl');
const ac = new AccessControl();

// controls for specific CRUD operations on listing records
// don't let users update an listing ID or the employeeID
ac
  .grant('employee')
  .condition({Fn:'EQUALS', args: {'requester':'$.owner'}})
  .execute('update')
  .on('listing');

ac
  .grant('employee')
  .execute('add')
  .on('listing');

ac
  .grant('employee')
  .condition({Fn:'EQUALS', args: {'requester':'$.owner'}})
  .execute('delete')
  .on('listing');

ac
  .grant('admin')
  .execute('delete')
  .on('listing');

//Exports method for checking permissions
exports.update = (requester, data) => {
    console.log(requester)
    console.log(data)
  return ac
    .can(requester.role)
    .context({requester:requester.ID, owner:data.employeeID})
    .execute('update')
    .sync()
    .on('listing');
}

exports.add = (requester) => {
  console.log(requester)
  return ac
    .can(requester.role)
    .execute('add')
    .sync()
    .on('listing');
}

// Different delete method for employee and admin
exports.empDelete = (requester, data) => {
  console.log(requester)
  console.log(data)
  return ac
    .can(requester.role)
    .context({requester:requester.ID, owner:data.employeeID})
    .execute('delete')
    .sync()
    .on('listing');
}

exports.adminDelete = (requester,data) => {
  console.log(requester)
  console.log(data)
  return ac
    .can(requester.role)
    .execute('delete')
    .sync()
    .on('listing');
}
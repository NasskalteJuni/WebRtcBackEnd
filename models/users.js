const users = {};

module.exports = {

    users: ()=> Object.values(users),
    addUser: (id, user)=> {
        if(!(users[id] && users[id] === user)) users[id] = user;
    },
    removeUser: (id)=> {
        if(users[id]) delete users[id];
    },
    idToUserMap: (id) => users[id],
    userToIdMap: (user) => {
        let match = Object.keys(users).filter(el => users[el] === user);
        return match.length === 1 ? match[0] : null;
    },

};
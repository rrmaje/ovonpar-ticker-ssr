let users = [{ id: 1, username: 'test@foo.com', password: 'test' }];
let reset = {};	


export const Users = {
    get,
	resetRef,
	setResetRef
};
function get(){

	return users;

}

function resetRef(){

	return reset;

}

function setResetRef(r){

	reset = r;

}

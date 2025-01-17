export function lowerCaseFirstLetter(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}
export function upperCaseFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
export function onErr(err) {
    console.log(err);
    return 1;
}
export function createName(url) {
    const EntityNameArr = url.split('-');
    let EntityName = [];
    EntityNameArr.map((str)=>{
        EntityName.push(upperCaseFirstLetter(str));
    })
    return EntityName.join(' ');
}
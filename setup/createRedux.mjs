import {createRedux} from './redux.mjs'
import fs from 'fs'
import prompt from 'prompt'
import {lowerCaseFirstLetter, onErr, createName} from './utils.mjs'

prompt.start();

prompt.get([{
    name: 'name',
    description: 'Name of entity from backend API',
    type: 'string',
    required: true
}], function (err, result) {
    if (err) return onErr(err);

    const url = result.name;
    const name = createName(url);
    const EntityName = name.replace(/ /g,'');
    const dirName= lowerCaseFirstLetter(EntityName);
    const stateName = `${EntityName}State`;
    const actionsName = `${lowerCaseFirstLetter(EntityName)}Actions`;
    const UpperCaseModel = url.replace(/-/g,'_').toUpperCase();
    createRedux(url,name, EntityName, dirName, stateName, actionsName, UpperCaseModel);
});



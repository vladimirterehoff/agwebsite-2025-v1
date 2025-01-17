import fs from 'fs'

function createRedux(url,name, EntityName, dirName, stateName,actionsName, UpperCaseModel) {
    const reduxDir = './app-redux/crudExample';

    fs.mkdirSync(  `./app-redux/${dirName}`, { recursive: true });

    const redux = async () => {
        try {
            let contents = await fs.readFileSync(`${reduxDir}/actions.ts`, { encoding: 'utf8' });
            contents = contents.replace(/url/g,`${dirName}Url`);
            contents = contents.replace(/CrudExampleModel/g,EntityName);
            contents = contents.replace(/crud_example/g,url);
            contents = contents.replace(/Crud Example/g,name);
            contents = contents.replace(/crudExampleActions/g,actionsName);
            fs.writeFileSync(`./app-redux/${dirName}/actions.ts`, contents);

            contents = await fs.readFileSync(`${reduxDir}/actionTypes.ts`, { encoding: 'utf8' });
            contents = contents.replace(/Crud Example/g,name);
            contents = contents.replace(/CRUD_EXAMPLE/g,UpperCaseModel);
            fs.writeFileSync(`./app-redux/${dirName}/actionTypes.ts`, contents);

            contents = await fs.readFileSync(`${reduxDir}/model.ts`, { encoding: 'utf8' });
            contents = contents.replace(/CrudExampleModel/g,EntityName);
            contents = contents.replace(/CrudExampleState/g,stateName);
            fs.writeFileSync(`./app-redux/${dirName}/model.ts`, contents);

            contents = await fs.readFileSync(`${reduxDir}/reducer.ts`, { encoding: 'utf8' });
            contents = contents.replace(/CrudExampleModel/g,EntityName);
            contents = contents.replace(/CrudExampleState/g,stateName);
            fs.writeFileSync(`./app-redux/${dirName}/reducer.ts`, contents);

            const stateFile = './app-redux/state.ts';
            contents = await fs.readFileSync(stateFile, { encoding: 'utf8' });
            contents =
                `import {${stateName}} from "@/app-redux/${dirName}/model";
${contents.substring(0,contents.lastIndexOf('}'))}
    ${dirName}: ${stateName};
}`;
            fs.writeFileSync(stateFile, contents);

            const reducerFile = './app-redux/reducers.ts';
            contents = await fs.readFileSync(reducerFile, { encoding: 'utf8' });
            contents =
                `import { default as ${dirName}Reducer } from '@/app-redux/${dirName}/reducer';
${contents.substring(0,contents.lastIndexOf('})'))}
    ${dirName}: ${dirName}Reducer,
})`;
            fs.writeFileSync(reducerFile, contents);
        } catch (err) {console.error(err.message);}
    };
    redux();
}

export {createRedux}
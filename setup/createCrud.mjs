import {createRedux} from './redux.mjs'
import fs from 'fs'
import prompt from 'prompt'
import {lowerCaseFirstLetter, onErr, createName} from './utils.mjs'

prompt.start();

prompt.get([
    {
        name: 'name',
        description: 'Name of entity from backend API',
        type: 'string',
        required: true
    },
    {
        name: 'isAdminDir',
        description: 'Admin directory (y/n)',
        type: 'string',
        required: true
    }], function (err, result) {
    if (err) return onErr(err);

    const isAdminDir = result.isAdminDir == 'y'? true : false;
    const url = result.name;
    const name = createName(url);
    const EntityName = name.replace(/ /g,'');
    const dirName= lowerCaseFirstLetter(EntityName);
    const stateName = `${EntityName}State`;
    const actionsName = `${lowerCaseFirstLetter(EntityName)}Actions`;
    const UpperCaseModel = url.replace(/-/g,'_').toUpperCase();

    //Create Redux
    createRedux(url, name, EntityName, dirName, stateName, actionsName, UpperCaseModel);

    //Create Pages
    const pagesDir =`./pages/${isAdminDir? 'admin/' : ''}${url}`;
    fs.mkdirSync(  pagesDir, { recursive: true });
    const pages = async () => {
        try {
            const exampleDir = `./pages/${isAdminDir? 'admin/' : ''}crudExample`;
            let contents = await fs.readFileSync(`${exampleDir}/[id].tsx`, { encoding: 'utf8' });
            contents = contents.replace(/CrudExample/g,EntityName);
            fs.writeFileSync(`${pagesDir}/[id].tsx`, contents);

            contents = await fs.readFileSync(`${exampleDir}/add.tsx`, { encoding: 'utf8' });
            contents = contents.replace(/CrudExample/g,EntityName);
            fs.writeFileSync(`${pagesDir}/add.tsx`, contents);

            contents = await fs.readFileSync(`${exampleDir}/index.tsx`, { encoding: 'utf8' });
            contents = contents.replace(/CrudExample/g,EntityName);
            fs.writeFileSync(`${pagesDir}/index.tsx`, contents);

        } catch (err) {console.error(err.message);}
    };
    pages();


    //Create Containers
    const containerDir =`./containers/Admin/${EntityName}`;
    fs.mkdirSync(  `${containerDir}`, { recursive: true });
    fs.mkdirSync(  `${containerDir}/Form`, { recursive: true });
    fs.mkdirSync(  `${containerDir}/List`, { recursive: true });
    const containers = async () => {
        try {
            const exampleDir = `./containers/Admin/CrudExample`;
            let contents = await fs.readFileSync(`${exampleDir}/List/index.tsx`, { encoding: 'utf8' });
            contents = contents.replace(/crudExampleActions/g,actionsName);
            contents = contents.replace(/Crud Example/g,name);
            contents = contents.replace(/crudExample/g,dirName);
            contents = contents.replace(/CRUD/g,UpperCaseModel);
            fs.writeFileSync(`${containerDir}/List/index.tsx`, contents);

            contents = await fs.readFileSync(`${exampleDir}/Form/index.tsx`, { encoding: 'utf8' });
            contents = contents.replace(/crudExampleActions/g,actionsName);
            contents = contents.replace(/Crud Example/g,name);
            contents = contents.replace(/crudExample/g,dirName);
            contents = contents.replace(/CRUD/g,UpperCaseModel);
            fs.writeFileSync(`${containerDir}/Form/index.tsx`, contents);
        } catch (err) {console.error(err.message);}
    };
    containers();

    //Update admin menu file
    const adminMenu = async () => {
        const menuFile = './components/Admin/NavBar/menu.ts';
        let contents = await fs.readFileSync(menuFile, { encoding: 'utf8' });
        contents =
`${contents.substring(0,contents.lastIndexOf('];'))}
    {
        title: '${name}',
        icon: FileCopyIcon,
        href: ADMIN_PATH.${UpperCaseModel}
    },
];`;
        fs.writeFileSync(menuFile, contents);
    }
    adminMenu();

    //Update router file
    const adminRouter = async () => {
        const menuFile = './utils/routers/admin.ts';
        let contents = await fs.readFileSync(menuFile, { encoding: 'utf8' });
        contents =
`${contents.substring(0,contents.lastIndexOf('};'))}
    ${UpperCaseModel} : ADMIN_MAIN + '${url}',
};`;
        fs.writeFileSync(menuFile, contents);
    }
    adminRouter();
});

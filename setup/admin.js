const fs = require('fs');

//REMOVE FILES
const paths = [
    './components/Site',
    './containers/Site',
    './containers/StyleGuide/Site',
    './hoc/site',
    './pages/account',
    './pages/password',
    './pages/sign-in',
    './pages/sign-up',
    './pages/style_guide/site.tsx',
    './pages/terms-of-use',
    './pages/index.tsx',
    './ssr/site.tsx',
    './styles/site',
    './utils/routers/site.ts',
    './utils/routers/noindex.ts',
];

paths.map(path => {
    fs.rmSync(path, { recursive: true, force: true }, (err) => {
        if (err) {
            console.error(err)
            return
        }
    })
})

//TRANSFER ADMIN FILES
const pages = [
    './pages/admin/crudExample',
    './pages/admin/password',
    './pages/admin/static_pages',
    './pages/admin/sign-in.tsx',
    './pages/admin/index.tsx',
];

pages.map(path => {
    var newPath = path.replace(/admin\//g,'');
    fs.renameSync(path, newPath);
});

fs.rmSync('./pages/admin', { recursive: true, force: true }, (err) => {
    if (err) {
        console.error(err)
        return
    }
})

//RENAME ADMIN ROUTER
const renameAdminRoute = async () => {
    try {
        let contents = await fs.readFileSync('./utils/routers/admin.ts', { encoding: 'utf8' });
        contents = contents.replace(/\/admin/g,'');
        fs.writeFileSync('./utils/routers/admin.ts', contents);
    } catch (err) {
        console.error(err.message);
    }
};
renameAdminRoute();

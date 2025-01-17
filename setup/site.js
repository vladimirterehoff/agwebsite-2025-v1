const fs = require('fs');

const paths = [
    './components/Admin',
    './containers/Admin',
    './hoc/admin',
    './pages/admin',
    './ssr/admin.tsx',
    './styles/admin',
    './utils/routers/admin.ts',
];

paths.map(path => {
    fs.rmSync(path, { recursive: true, force: true }, (err) => {
        if (err) {
            console.error(err)
            return
        }
    })
})
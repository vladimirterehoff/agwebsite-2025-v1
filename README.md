## Install project

#### 1. Install node.js and npm  (Recomended version 16)

#### 2. Install npm pakcages
npm install

#### 3. Build the project
npm run build

#### 4.  Start project

###### DEV environment
npm run dev

###### PROD environment
npm run start

## Helper commands

#### 1. Setup site only: remove all admin directories and files
npm run setup_site

#### 2. Setup admin only: remove all site directories and files
npm run setup_admin

#### 3. Create redux: create redux architecture for the new entity
npm run create_redux

#### 4. Create CRUD: create crud architecture for the new entity
npm run create_crud

## Documentation

**app-redux** - store of the project: separate directories for each entity (arhitecture of entities based on the BE arhitecture) and base config files. Entity directory include:

action - requests for this entity

model - model of the entity and model of the state

actionTypes - action types for the reducer

reducer - rules to the transform of entity state.

**pages** - pages of the project

**containers** - containers for each page. Containers include content of the page without constant components (header, footer, global layout). Container can have inside Components directory with unique components only for this page. Global components (which are present in the project in several places) must be in component directory

**components** - directory for global components of the project (components which are present in the project in several places)

**hoc** - HOC for private and authorize pages, that help check access for this pages

**hooks** - global hooks

**services** - axios(base config file) and cookie

**ssr** - config files of the server side rendering  

**utils** - global constants and functions of the project

**theme** - MUI theme config

**styles** - base styles for the project
_**Important:** styles for the component set to the style.module.scss file in component directory, not in the styles directory._

**setup** - Scripts for the Helper commands (setup site, setup admin, create redux, create crud)

## StyleGuide

#### Form Elements - /style_guide/common
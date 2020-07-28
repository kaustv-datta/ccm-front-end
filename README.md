# CcmFrontEnd

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.2.

## Getting started

1. Install [Node.js](https://nodejs.org/en/)
2. Install Angular CLI
(second line may be required also)

```
npm install -g @angular/cli
npm install --save-dev @angular-devkit/build-angular
```
3. Include all required node modules in the project
```
npm install
```

## Emulate data server

We need to put the dummy_data directory onto a local server so that we can make requests for its data from our front-end server.

1. Install http-server
```
npm install -g http-server
```
2. In a terminal in the repository root, run:
```
http-server ./dummy_data --cors
```
There should now be a localhost directory for the data in one of the links presented (e.g. http://127.0.0.1:8080)
This is emulating the data AWS bucket that we will be using


## Run with Docker (preferred when possible)

### [Install Docker](https://docs.docker.com/desktop/)

Also install docker-compose

Be careful to read if your machine is able to run Docker. Windows machines will require [WSL 2](https://docs.microsoft.com/en-us/windows/wsl/wsl2-index), which in turn requires the May 2020 Windows 10 update:

### Build and run container

```
docker-compose build
docker-compose up
```

Let us know if anything goes wrong!

## Run with Angular

### Folder structure

This project's folder structure has been designed by following the [angular-folder-structure](https://angular-folder-structure.readthedocs.io/en/latest/index.html) project principles.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

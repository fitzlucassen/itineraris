Itineraris
==========

Itineraris is an angular 4 project generated with [angular-cli](https://github.com/angular/angular-cli) that allows people to create their travel itineraries and allows them to share them.

Stack
-----
Angular 4, TypeScript, HTML5, Service Worker JS

Development server
-------------------
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Code scaffolding
-------------------
Run `ng g component component-name` to generate a new component. You can also use `ng g directive/pipe/service/class`.

Build
-----

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

Running unit tests
-------------------
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

Running end-to-end tests
-------------------
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

Current deployment process
--------------------------
ng build --prod --aot
npm run precache

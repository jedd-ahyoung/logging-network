# aurelia-logging-network

This library is built for the [Aurelia](http://www.aurelia.io/) platform and contains a network-based log appender for the Aurelia logging library.

## Dependencies

* [aurelia-logging](https://github.com/aurelia/logging)

## Building The Code

To build the code, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. From the project folder, execute the following command:

  ```shell
  npm install
  ```
3. Ensure that [Gulp](http://gulpjs.com/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g gulp
  ```
4. To build the code, you can now run:

  ```shell
  gulp build
  ```
5. You will find the compiled code in the `dist` folder, available in three module formats: AMD, CommonJS and ES6.

6. See `gulpfile.js` for other tasks related to generating the docs and linting.

## Running The Tests

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, proceed with these additional steps:

1. Ensure that the [Karma](http://karma-runner.github.io/) CLI is installed. If you need to install it, use the following command:

  ```shell
  npm install -g karma-cli
  ```
2. Ensure that [jspm](http://jspm.io/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g jspm
  ```
3. Download the [SystemJS](https://github.com/systemjs/systemjs) module loader:

  ```shell
  jspm dl-loader
  ```

4. You can now run the tests with this command:

  ```shell
  karma start
  ```

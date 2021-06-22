# IWAExpress (Insecure Web App)

### Table of Contents

*   [Overview](#overview)
*   [Running the Application](#running-the-application)
*   [Developing the Application](#developing-the-application)
*   [Developing and Contributing](#developing-and-contributing)
*   [Licensing](#licensing)

## Overview

_IWAExpress (Insecure Web App)_ is an example JavaScript NodeJS/Express Web Application for use in **DevSecOps** scenarios and demonstrations.
The source code includes some examples of insecure code - which can be found using static and dynamic application
security testing tools such as [Fortify SCA](https://www.microfocus.com/en-us/products/static-code-analysis-sas),
[Fortify On Demand](https://www.microfocus.com/en-us/products/application-security-testing)
and [Fortify WebInspect](https://www.microfocus.com/en-us/products/webinspect-dynamic-analysis-dast).

*Please note: the application should not be used in a production environment!*

## Running the Application

To run the application you will need to have installed [Docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/).
On Windows you can use [Docker Desktop](https://www.docker.com/products/docker-desktop) - ensure you are using Linux containers.
The provided [docker-compose.yml](docker-compose.yml) file will download/run a container for [MySQL](https://www.mysql.com/) and [Adminer](https://www.adminer.org/) 
as well as the application itself.

To start the application, execute the following from a command line:

```
docker-compose --profile dev up --build
```

The application "app" will wait for the MySQL database to be available and then create the database it requires - this will take approx 30-40 seconds.

You can then navigate to the URL: [http://localhost:3000](http://localhost:3000). 

The website allows you to login with the following default users:

- **user1@localhost.com/password**
- **user2@localhost.com/password**

There should be some sample data pre-loaded.

Once you have finished with the application, use Ctrl-C to stop docker-compose. If you want to remove the containers you can execute the following 
command:

```
docker-compose --profile dev rm
```

### Developing the application

To develop the application you will need to have first installed [NodeJS](https://nodejs.org/).

If you want to make changes to the application, you should first bring up the MySQL and Adminer containers using the following command:

```
docker-compose up -d
```

Next, install the required node modules locally using:

```
npm install --save
npm install -g nodemon
```

Now you can create and populate a development database using:

```
node .\sql\dbCreate.js
```

Finally you can start the application using:

```
npm run dev
```

Browse to [http://localhost:3000](http://localhost:3000) and login with the same accounts as above.

As this is a Node/Express app started using *nodemon* you can make changes to the code and they will be automatically reflected in the app.
Note: A Visual Studio solution file (IWAExpress.sln) and NodeJS project file (IWAExpress.njsproj) are also included so you can run and develop the
application within Visual Studio.

## Developing and Contributing

Please see the [Contribution Guide](CONTRIBUTING.md) for information on how to develop and contribute.

If you have any problems, please consult [GitHub Issues](https://github.com/mfdemo/IWAExpress/issues) to see if has already been discussed.

## Licensing

This application is made available under the [GNU General Public License V3](LICENSE)
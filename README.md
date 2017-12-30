# Web of Registries
### Developed by Zach Zundel
#### Google Summer of Code 2017
This tool indexes known instances of SynBioHub and informs them about each other, which permits powerful federated querying and data storage. 

API documentation can be found [here](https://synbiohub.github.io/Web-of-Registries/#introduction).

## Installation
Web of Registries installation depends on Git and NodeJS, please consult their install documentation before beginning.

To install the Web of Registries, clone the repository onto the server.
```
$ git clone https://github.com/synbiohub/web-of-registries
```

Enter the resulting directory and use NPM to install the JavaScript dependencies.
```
$ cd web-of-registries
$ npm install
```

Start the server, it will be accessible on port 9999. 
```
$ npm start
```

On first startup, the Web of Registries will display a registration screen. Once you are registered, you can add or remove users, change settings, or view pending join requests.

To enable email functionality, a SendGrid API key is needed.

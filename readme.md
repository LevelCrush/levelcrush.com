# levelcrush.com

This repository contains the code that is represented on the following domains (**currently**)

-   [levelcrush.com](https://wwww.levelcrush.com) (Production, intended for only stable and finalized features)
-   [stage.levelcrush.com](https://stage.levelcrush.com) (Stage , intended for public testing of new features)
-   [dev.levelcrush.com](https://dev.levelcrush.com) (Unstable and intended for developers only)

---

## Installing and building

Building and installing locally requires a number of dependencies. You will need the following items before successfully running this server build

### **Minimum Dependencies**

-   Node.js Version 16.x LTS minimum: [Official Site](https://nodejs.org)
-   A running build of the repository [@LevelCrush/api.levelcrush.com](https://github.com/LevelCrush/api.levelcrush.com)
-   A running build of the repository [@LevelCrush/login.levelcrush.com](https://github.com/LevelCrush/login.levelcrush.com)

The local builds for **api.levelcrush** and **login.levelcrush** are recommended to run locally, but you are welcome to run it inside a virtual machine/container whatever you prefer, wherever you want. Just be sure to remember your hostname your using + port you use for each as it IS important, as you will need to populate an env.ts file before running.

**Note:** levelcrush.com itself as an application does not require a database running. However the services that are running on **api.levelcrush** and **login.levelcrush** **DO REQUIRE** a working MYSQL database setup either locally or externally. You should have that setup when you were going through the build and install process for the other required repositories.

**DO NOT** use the "**LevelCrush**" production or "**LevelCrushStaging**" mysql server running on lightsail. These two instances are intended to only run on the live versions of the site that are accessible.

## How to run the server?

If you are looking to run the server locally with typescript runtime support (**Recommended for development**) Then you can run the following command below from your terminal.

```
npm run debug
```

If you have setup a env.ts and need to build the application

```
npm run build
```

Respectively once you have built the source successfully and if you are not looking to do any development, and are looking to run the server as if you would be in a production enviroment, then run the following command.

```
npm run production
```

At the moment of writing, the following command is equivalent to running the production script.

```
node dist/app.js
```

---

## Creating an env.ts file

Before you can successfully build the server you must create a **env.ts** file inside the src folder. Below you find a simple visual to confirm the location of said env.ts and where it should go.

```
Folder structure example
| levelcrush
    | readme.md
    | tsconfig.json
    | ...
    | assets
    | templates
    | src
        | ...
        | env.ts <- this is where your env.ts should go
        | env_interface.ts <- use this as a template if you do not have a env.ts

```

### **YOU MUST MANUALLY CREATE env.ts inside the src folder**

### env_interface.ts definition

Possible configuration for an env.ts file

```typescript
export interface ENV {
    server?: {
        session?: {
            ttl?: 86400 | number;
            secret?: string;
        };
        port?: number;
        assets?: string;
        domain?: string;
        url?: string;
        engine?: 'pug'; // the only current choice right now
        views?: string;
        ssl?: {
            key: string;
            cert: string;
        };
    };
    hosts: {
        api: string;
        login: string;
        frontend: string;
    };
    platforms: {
        api: {
            token: string;
            token_secret: string;
        };
        discord: {
            oauth: {
                urls: {
                    authorize: string;
                    token: string;
                    revoke: string;
                };
                client_id: string;
                client_secret: string;
                public_key: string;
            };
        };
    };
}

export default ENV;
```

### What your env.ts should look like

```typescript
import * as path from 'path';
import ENV from './env_interface';

export const Environment: ENV = {
    server: {
        session: {
            ttl: 21600, // 6 hours
        },
        port: 8082, // recommended but your choice
        assets: path.join(__dirname, '..', 'assets'), // recommended
        domain: 'levelcrush.local', // set this to your respective host
        url: 'http://levelcrush.local', // set this to the url you access the build
        engine: 'pug', // required
        views: path.join(__dirname, '..', 'templates'), // recommended
    },
    hosts: {
        api: 'http://api.levelcrush.local', // localhost:8081 is valid
        frontend: 'http://levelcrush.local', // localhost:8080 is valid
        login: 'http://login.levelcrush.local', // localhost:8082 is valid
    },

    platforms: {
        api: {
            token: '[application login token provided by api.levelcrush]',
            token_secret: '', // not yet used
        },
        discord: {
            oauth: {
                urls: {
                    authorize: 'https://discord.com/api/oauth2/authorize',
                    token: 'https://discord.com/api/oauth2/token',
                    revoke: 'https://discord.com/api/oauth2/token/revoke',
                },
                client_id: '[yourtokenhere]',
                client_secret: '[yoursecrethere]',
                public_key: '[publickeyhere]',
            },
        },
    },
};

export default Environment;
```

Once you have setup your env.ts you should successfully be able to build your levelcrush.com equivalent website

---

## What's the stack

### Below is a table of "packages" that we use

| Package    | Used Where                                                   |
| ---------- | ------------------------------------------------------------ |
| Typescript | Application Language                                         |
| Express    | Web Server                                                   |
| Pug        | Template engine for pages                                    |
| Axios      | Backend web request to api.levelcrush and login.levelcrush   |
| moment     | Date formating and timestamps                                |
| ts-node    | Used to run debug builds with typescript support at runtime. |

### Table of Middlewhere and what package uses it

| Middleware      | Used By |
| --------------- | ------- |
| body-parser     | express |
| cors            | express |
| express-session | express |
| multer          | express |

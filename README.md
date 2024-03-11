# Project Structure

Here’s a breakdown of the file structure in our project:

- **inv-ms-api** - This is likely the root directory of the project. It contains all of the other files and folders in the project.

- **public** - This folder likely contains the static files that will be served by the web server. This may include things like uploaded files, default files etc.
- **src** - This folder contains the source code for our express api.

  - **middlewares** - This folder likely contains middleware code.
  - **users** - This a sample resource folder for our api entities such as user, suppliers, ect. it always contains 4 different files (models, controllers, route and validation) related to that resource of the application.

    - **controller.js** - This file likely contains the controller code for the users feature of the application. Controllers are a part of Angular that handle user interaction and update the view accordingly.
    - **model.js** - This file likely contains the model code for the users feature of the application.
    - **route.js** - This file likely contains the routing code for the users feature of the application.
    - **validation.js** - This file likely contains the validation code for the users feature of the application.

  - **utils** - This folder likely contains utility code that can be used throughout the application. This may include things like helper functions and common components (functions).
    - **index.js** - This file is likely the entry point for the express application. It is the first file that is loaded when the application starts.
  - **.env** - contains private resources.

- **.gitignore** - This file tells Git which files and folders to ignore. Git is a version control system that helps developers track changes to their code.
- **package.json** - This file contains information about the project, such as the name of the project, the version of Angular that you are using, and the dependencies of the project. Dependencies are other projects that the project relies on.
- **README.md** - This file is a markdown file that contains information about the project, such as how to set up the project and how to use it.

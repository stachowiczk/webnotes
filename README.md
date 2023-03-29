# WebNotes - A simple note taking app
### v1.0.0

## Features
- Full stack web application: React.js + Python-Flask
- SQLite3 database with SQLAlchemy ORM
- User registration and login with JWT authentication
- Create, edit, and delete notes
- Built-in text editor (React Quill)
- Basic formatting tools, four available fonts
- Mobile device support
- Responsive design
- Resizable UI elements
- Dark/light mode

### Planned features
- More fonts
- User settings (change password, change username, etc.)
- Folder/tags support
- Note sharing and collaboration

#### Live version coming soon

## Screenshots
![Registration](https://i.imgur.com/EjM55lp.png)
![Registration](https://i.imgur.com/8aaIe5x.png)
![Login page](https://i.imgur.com/Da5gDiw.png)
![Main page - formatting](https://i.imgur.com/0zL5U14.png)
![Main page](https://i.imgur.com/Cc59mDu.png)
![Main page - expanded](https://i.imgur.com/GARWhTx.png)

### How to run the dev server
Requirements.txt is functional, but contains a lot of unnecessary packages. I will clean it up later.
###### Initialize venv:
```python -m venv venv```

```source venv/bin/activate```
###### Install the required packages:
```pip install -r requirements.txt```
#### requires a config.py file with a secret key for JWT authentication and setting up SQLAlchemy.



###### Example config.py: 
Environment variable support will be implemented later.
CSRF will be disabled for now, as it is not needed for the current state of the app. Make sure it is disabled in the config file.

```
SQLALCHEMY_DATABASE_URI = "sqlite:///your_database_filename.db"
SQLALCHEMY_TRACK_MODIFICATIONS = True
JWT_SECRET_KEY = "your_super_secret_key"
JWT_TOKEN_LOCATION = ["cookies"]
JWT_COOKIE_CSRF_PROTECT = False

```


place the file in the 'server' directory and run:

```flask db init```

```flask db migrate```

```flask db upgrade``` # make sure the Alembic script is correct


to create the database schema and initialize the database.




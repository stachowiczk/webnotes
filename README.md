# Note editor v0.6 
### Development version 

#### requires a config.py file with a secret key for JWT authentication and setting up sqlite3
##### requirements_backup.txt should be used instead of requirements.txt
###### the list currently includes some redundancies :TODO

###### Example config.py: 

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

```flask db upgrade```


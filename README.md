# Running locally

```sh
$ docker-compose up --build
```

Then, go to `http://localhost:8000/user/all` to test out the caching. To clear the cache explicitly, go to `http://localhost:8000/delete/cache` and go back to `user/all` again to see the cache was cleared.

# Importing data

Exec into the mongodb container, go to `/app/config` folder and run
```sh
mongoimport --collection=users MOCK_DATA.json
```
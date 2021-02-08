# image-repository

This is a server that allows users to register new accounts and signin. They can then use that account to upload, retrieve and delete images to and from the server.

## How to Run Locally

1. Ensure you have docker running. Otherwise install docker from https://docs.docker.com/get-docker/
2. In a terminal, cd to the root directory of this project
3. Run the following command on terminal:
```
docker-compose up
```
4. You will now had the server running on http://localhost:8080/

## API Documentation

- **Description: Signup new user**
```shell
$ curl -H "Content-Type: application/json" -X POST -d '{"username": "new_username", "password": "new_password"}' http://localhost:8080/api/users/signup
```

- **Description: Signin with existing user account**
```shell
$ curl -H "Content-Type: application/json" -X POST -d '{"username": "new_username", "password": "new_password"}' -c cookie.txt http://localhost:8080/api/users/login
```

- **Description: logout from user account**
```shell
$ curl -H "Content-Type: application/json" -X GET -d '{"username": "new_username", "password": "new_password"}' -b cookie.txt http://localhost:8080/api/users/logout
```

- **description: upload image after logging in**
```shell
$ curl -F 'image=@file_path' -b cookie.txt http://localhost:8080/api/images
```

- **description: retrieve id's for all images uploaded by current user**
```shell
$ curl -b cookie.txt http://localhost:8080/api/images/mine
```

- **description: retrieve id's for all images publicly available**
```shell
$ curl -b cookie.txt http://localhost:8080/api/images/public
```

- **description: retrieve user's image with ID**
```shell
$ curl -b cookie.txt http://localhost:8080/api/images/mine/image_id --output file
```

- **description: retrieve a public image with ID**
```shell
$ curl -b cookie.txt http://localhost:8080/api/images/public/image_id --output file
```

- **description: update the public sharing of an image**
```shell
$ curl -H "Content-Type: application/json" -X PATCH -d '{"public": false}' http://localhost:8080/api/images/image_id
```
Note: Send {"public": false} to make image private and send {"public": true} to share image with public.

- **description: delete an image with ID**
```shell
$ curl -X DELETE -b cookie.txt http://localhost:8080/api/images/image_id
```

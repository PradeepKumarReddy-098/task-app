# Tasks App Backend Development

The code offers functionalities for registering and logging in users, creating tasks, retrieving specific tasks, and updating or deleting tasks. It also incorporates error handling to provide informative messages for debugging purposes.

### Technologies

- Node.js
- Express.js
- sqlite3

## API Documentation

<Section id="section1" >

### API 1

#### Path: `/users/register`

#### Method: `POST`

**Request**

```
{
    "username":"Ramesh",
    "password":"Ramesh@123"
}
```

**Description**: <br />
If their is no user with the username you entered in the database then registation will successful.<br />
**Response**<br />

##### success

```
{
    "message": "User created successfully"
}
```

##### Error

If their is an user with username you entered. then the response will be

```
{
    "message": "Username already exits please. Try another name"
}
```

</Section>

<Section id="section2" >

### API 2

#### Path: `/users/login`

#### Method: `POST`

**Request**

```
{
    "username":"Ramesh",
    "password":"Ramesh@123"
}
```

**Description**: <br />

- Fetches user by username from the database.
- Compares password using bcrypt for secure validation.
- Generates and sends a JWT token upon successful login
- Handles errors gracefully and provides informative messages.
  <br />
  **Response**
  <br />

##### success

```
{
    "jwt_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTcxNDU1MTU5Nn0.v1gup7Q............."
}
```

##### Error

If the login is unsuccessful.<br />
cases: <br />

- Enter invalid username or password.
- Enter invalid Password

```
{
    "message": "Invalid username or password"
}
```

```
{
    "message": "Invalid password"
}
```

</Section>

<Section id="section3" >

### API 3

#### Path: `/tasks`

#### Method: `POST`

**Description**
<br />
Creates a new task for the authenticated user. Requires a valid JWT token in the authorization header.
<br/>

**Request**

```
{
    "title":"task-1",
    "description":"testing the apis of the application",
    "status":"Inprogress",
    "dueDate":"2024-05-01"
}
```

**Response**
<br />
**Success**

```
{
    "message": "Task created successfully"
}
```

**Error**<br/>
status code: 400 (Bad Request)<br/>

- if we haven't provided any field.<br />
  body:
  ```
  { message: 'Please provide all necessary task details' }
  ```

##### Note : if their is any other error while creating the task. The error will display.

</Section>

<Section id="section4">

### API 4

#### Path: `/tasks`

#### Method: `GET`

**Description**
<br />
Retrieves all tasks for the authenticated user.
<br/>

**Response**
<br />
**Success**

```
[
    {
        "id": 8,
        "title": "task-1",
        "description": "testing the apis of the application",
        "status": "Inprogress",
        "user_id": 3,
        "created_at": "2024-5-1",
        "due_date": "2024-05-01",
        "updated_at": null
    }
]
```

**Error**<br/>
If we haven't provided the jwt_token.
status code: 400 (Bad Request)<br/>
body:

```
{
  "message": "Unauthorized user"
}
```

</Section>


<Section id="section5r">
    
### API 5

#### path:  `/tasks/:taskId`

#### Method: `GET`
    
</Section>

<Section id="section5>

### API 5

#### Path: `/tasks/:taskId`

#### Method: `GET`

**Description**
<br />
Retrieves a specific task by its ID. JWT token is required.
<br/>

**Response**
<br />
**Success**

```
{
    "id": 8,
    "title": "task-1",
    "description": "testing the apis of the application",
    "status": "Inprogress",
    "user_id": 3,
    "created_at": "2024-5-1",
    "due_date": "2024-05-01",
    "updated_at": null
}
```

**Error**<br/>
if we try to access the task which is not created by you.
status code: 400 (Bad Request)<br/>
body:

```
{
  "message": "Unauthorized, You can't access this task. You can only access your own entries"
}
(if the task with the provided ID doesn't)

{ message: 'Task not found' }
```

</Section>

<Section id="section6>

### API 6

#### Path: `/tasks/:taskId`

#### Method: `PUT`

#### Path Parameter: ID (tasks)

**Description**
<br />
Updates an existing task.. JWT token is required.

<br/>

**Response**
<br />
**Success**
<br />

```
{
    "message": "Task updated successfully"
}
```

**Error**<br/>
if we try to update the task which is not created by you.
status code: 400 (Bad Request)<br/>
if you haven't provided the detalis like title,description,due_date,status <br />
body:

```
{ message: 'Please provide all necessary task details' }
```

if you try to update the task of which is not belongs to you <br />

```
  {
    "message": "Unauthorized, You can't access this task. You can only access your own entries"
}
```

</Section>

<Section>
    
### Api 7

#### path: `/tasks/:taskId`

#### Method: `DELETE`

#### Path Parameter: ID (tasks)

**Response**
<br />
**Success**
<br />

```
{
    "message": "Task deleted successfully"
}
```
    
</Section>
<br/>

Use `npm install` to install the packages.

**Export the express instance using the default export syntax.**

**Use Common JS module syntax.**

# Hack the North 2021 Backend Challenge

## Endpoints:

<details>
 <summary><code>GET</code> <code><b>/</b></code> <code>(overwrites all in-memory stub and/or proxy-config)</code></summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | None      |  required | object (JSON or YAML)   | N/A  |


##### Responses

> | code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `201`         | `text/plain;charset=UTF-8`        | `Configuration created successfully`                                |
> | `400`         | `application/json`                | `{"code":"400","message":"Bad Request"}`                            |
> | `405`         | `text/html;charset=utf-8`         | None                                                                |

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:8889/
> ```

</details>

<details> <summary>GET <code>/users/</code></summary> 

Returns a list of all users.

#### Parameters:

- None

#### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `201`         | `text/plain;charset=UTF-8`        | `Configuration created successfully`                                |
> | `400`         | `application/json`                | `{"code":"400","message":"Bad Request"}`                            |
> | `405`         | `text/html;charset=utf-8`         | None    

**Response format:**

```json
{
  "name": <string>,
  "company": <string>,
  "email": <string>,
  "phone": <string>,
  "skills": [
    {
      "skill": <string>,
      "rating": <int>
    }
  ]
}
```
</details>

### GET /users/{id}
Returns a single user with format.

`id` is the hacker_id of the user

```json
{
  "name": <string>,
  "company": <string>,
  "email": <string>,
  "phone": <string>,
  "skills": [
    {
      "skill": <string>,
      "rating": <int>
    }
  ]
}
```

### PUT /users/:id
Updates 
# Hack the North 2021 Backend Challenge

## Endpoints:

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | None      |  required | object (JSON or YAML)   | N/A  |


<details> <summary><b>GET</b> <code>/users/</code></summary> 

Returns a list of all users.

#### Parameters:

- None

#### Responses:

**code 200:

        ```json
        [
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
        ]
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
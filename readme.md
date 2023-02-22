# Hack the North 2023 Backend Challenge

## Database setup:

To set up the database, run the script in the root directory with the command 

> `node tableSetup`.

## Endpoints:

<!-- 

GET ALL USERS

 -->

<details> <summary><b>GET</b> <code>/users/</code></summary> 

Returns a list of all users.

#### Parameters:

- None

#### Responses:

> <table>
<tr>
<td> <b>Code</b> </td> <td> <b>Description</b> </td>
</tr>
<tr>
<td> 200 </td>
<td>

Successful operation

<details> <summary> Example value </summary>

```json
[
  {
      "name": "Breanna Dillon",
      "company": "Jackson Ltd",
      "email": "lorettabrown@example.net",
      "phone": "+1-924-116-7963",
      "skills": [
        {
          "skill": "Swift",
          "rating": 4
        },
        {
          "skill": "OpenCV",
          "rating": 1
        }
      ]
    }
]
``` 
</details>

</td>
</tr>
</table>

</details>


<!-- 

GET SPECIFIC USER

 -->

<details> <summary><b>GET</b> <code>/users/{id}</code></summary> 

Returns the user data for a specific user.

#### Parameters:

<blockquote>
<table>
<tr>
<td><b>Name</b></td>
<td><b>Type</b></td>
<td><b>Data Type</b></td>
<td><b>Description</b></td>
</tr>

<tr>
<td>id</td><td>path</td><td>integer</td><td>hacker_id of user to return </td>
</tr>
</table>
</blockquote>


#### Responses:

> <table>
<tr>
<td> <b>Code</b> </td> <td> <b>Description</b> </td>
</tr>
<tr>
<td> 200 </td>
<td>

Successful operation

<details> <summary> Example value </summary> 

```json
  [
    {
      "name": "Breanna Dillon",
      "company": "Jackson Ltd",
      "email": "lorettabrown@example.net",
      "phone": "+1-924-116-7963",
      "skills": [
        {
          "skill": "Swift",
          "rating": 4
        },
        {
          "skill": "OpenCV",
          "rating": 1
        }
      ]
    }
  ]
```

</details>


</td>
</tr>

<tr>
<td> 400 </td>
<td> Invalid id value </td>

</tr>
</table>


</details>

<!-- 

UPDATE USER

 -->

<details> <summary><b>PUT</b> <code>/users/{id}</code></summary> 

Update an existing hacker.

#### Parameters:

<blockquote>
<table>
<tr>
<td> <b>Name</b> </td> <td> <b>Type</b> </td> <td> <b>Data type</b> </td> <td> <b>Description</b> </td>
</tr>
<tr>
<td> id </td> <td> path </td> <td> integer </td> <td> hacker_id of user to update </td>
</tr>
<tr>
<td> body </td> <td> body </td> <td> json object </td> <td> 
Json object holding hacker data to be updated. Can be a partial update.

<details><summary>Example value </summary>

```json

    {
      "phone": "+1 (555) 123 4567",
      "skills": [
        {
          "skill": "Swift",
          "rating": 10
        },
        {
          "skill": "Python",
          "rating": 1
        }
      ]
    }
  
```

</details>

</td>
</tr>
</table>
</blockquote>


#### Responses:

> <table>
<tr>
<td> <b>Code</b> </td> <td> <b>Description</b> </td>
</tr>
<tr>
<td> 200 </td>
<td>

Successful operation

<details> <summary>Example value</summary>

```json
  {
      "name": "Breanna Dillon",
      "company": "Jackson Ltd",
      "email": "lorettabrown@example.net",
      "phone": "+1 (555) 123 4567",
      "skills": [
        {
          "skill": "Swift",
          "rating": 10
        },
        {
          "skill": "OpenCV",
          "rating": 1
        },
        {
          "skill": "Python",
          "rating": 1
        }
      ]
    }
```

</details>
</td>
</tr>
<tr> 
<td> 400 </td>

<td> Invalid id or body values </td>
</tr>
</table>


</details>


<!-- 

GET ALL SKILLS

 -->

<details> <summary><b>GET</b> <code>/skills/</code></summary> 

Returns a list of skills with aggregated info.

#### Parameters:

<blockquote>
<table>
<tr>
<td> <b>Name</b> </td> <td> <b>Type</b> </td> <td> <b>Data type</b> </td> <td> <b>Description</b> </td>
</tr>
<tr>
<td> min_frequency </td> <td> query </td> <td> integer </td> <td> minimum count for filtering skills </td>
</tr>
<tr>
<td> max_frequency </td> <td> query </td> <td> integer </td> <td> maximum count for filtering skills </td>
</tr>
</table>
</blockquote>


#### Responses:

> <table>
<tr>
<td> <b>Code</b> </td> <td> <b>Description</b> </td>
</tr>
<tr>
<td> 200 </td>
<td>

Successful operation

<details> <summary>Example value</summary>

```json
[
  {
    "name": "Python",
    "frequency": 10
  }
]
```

</details>
</td>
</tr>
<tr> 
<td> 400 </td>

<td> Invalid min_frequency or max_frequency values </td>
</tr>
</table>
</details>


## Improvements beyond minimum requirements:

* JSON schema validation:
  * Whenever an endpoint has a parameter that receives a JSON object, its form will be validated by the schemas in `src/schemas.js`.

* HTTP codes:
  * Endpoints return the proper HTTP codes according to convention.


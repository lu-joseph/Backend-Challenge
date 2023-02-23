# Hack the North 2023 Backend Challenge

## Setup:

To set up the database, run the script in the root directory with the command 

> `node tableSetup`

To set up the packages, run command

> `npm install`

## Run backend server:

To run the backend server, run command

> `npm start`

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
<td> 201 </td>
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

<!-- 

INSERT/UPDATE SKILL

 -->

<details> <summary><b>PUT</b> <code>/skills/</code></summary> 

Updates a skill's rating if it already exists, otherwise inserts skill into the skills table.

#### Parameters:

<blockquote>
<table>
<tr>
<td> <b>Name</b> </td> <td> <b>Type</b> </td> <td> <b>Data type</b> </td> <td> <b>Description</b> </td>
</tr>
<tr>
<td> body </td> <td> body </td> <td> JSON object </td> <td> JSON object for skill
<details>
<summary>
Example value
</summary>

```json
{
  "hacker_id": 1,
  "skill": "Swift",
  "rating": 10
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
<td> 201 </td>
<td>

Successful operation

<details> <summary>Example value</summary>

```json
{
  "skill": "Swift",
  "rating": 10
}
```

</details>
</td>
</tr>
<tr> 
<td> 400 </td>

<td> Invalid body JSON  </td>
</tr>
</table>
</details>

<!-- 

GET EVENT

 -->

<details> <summary><b>GET</b> <code>/events/{id}</code></summary> 

Returns data for a specific event.

#### Parameters:

<blockquote>
<table>
<tr>
<td> <b>Name</b> </td> <td> <b>Type</b> </td> <td> <b>Data type</b> </td> <td> <b>Description</b> </td>
</tr>
<tr>
<td> id </td> <td> path </td> <td> integer </td> <td> event_id for event to return

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
  "name": "Drone Show",
  "hackers": [
    1,
    2,
    3
  ]
}
```

</details>
</td>
</tr>

</table>
</details>

<!-- 

GET ALL EVENTS

 -->

<details> <summary><b>GET</b> <code>/events/</code></summary> 

Returns a list of events with aggregated info.

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

<details> <summary>Example value</summary>

```json
[
  {
    "name": "Bubble Soccer",
    "attendance": 126
  }
]
```

</details>
</td>
</tr>

</table>
</details>


<!-- 

PUT EVENT ATTEND

 -->

 <details> <summary><b>PUT</b> <code>/events/attend</code></summary> 

Updates involvements table to accomodate for a hacker attending an event.

#### Parameters:

<blockquote>
<table>
<tr>
<td> <b>Name</b> </td> <td> <b>Type</b> </td> <td> <b>Data type</b> </td> <td> <b>Description</b> </td>
</tr>
<tr>
<td> body </td> <td> body </td> <td> JSON object </td> <td> event_id for event to return

<details>
<summary>
Example value
</summary>

```json
{
  "hacker_id": 1,
  "event_id": 5
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
<td> 201 </td>
<td>

Successful operation

<details> <summary>Example value</summary>

```json
{
  "hacker_id": 1,
  "event_id": 5
}
```

</details>
</td>
</tr>

<tr>
<td> 400 </td>

<td> Unsuccessful operation </td>
</tr>

</table>
</details>


## Improvements beyond minimum requirements:

* JSON schema validation:
  * Whenever an endpoint has a parameter that receives a JSON object, its form will be validated by the schemas in `src/schemas.js`.

* HTTP codes:
  * Endpoints return the proper HTTP codes according to convention.

* Events:
  * Endpoints to deal with hackers attending events
  * Events and Involvements tables created to manage hacker and event attendance information
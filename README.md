# CakePals

## CakePals is an app where people can sell home-baked cakes and pies to each other.

Bakers can register on CakePals and list their products for sale.
Users typically look for available offerings nearby, create a member account (if needed), and place a baking order.
Bakers receive orders, bake, and hand over ready products at the agreed collection time.
Members can review orders and orders reviews form the Baker's rate

## Technologies Used by this App Until Now

    - Node.JS
    - Express.JS
    - NPM
    - MongoDB
    - Redis
    - Travis
    - Stripe
    - Nodemon

### NOTE: The repo is still in development and will be releasing updates and using more technologies soon

## Storage

I go with a document database (MongoDB).
And host database at Mongo Atlas.

### Schema

\*\* I needed to create 4 Models

**Products**:
| Attribute | Type |
|------------| ------- |
| Type | String |
| creator | ref->User |
| bakingTime | Object |
| price | Number |

---

**User**:
| Attribute | Type |
|---------------- |------- |
| Name | String |
| Email | String |
| Role | String |
| Password | String |
| PasswordConfirm | String |
| location | Object |
| busyTime | Object |

---

**Reviews**:
| Attribute | Type |
|---------- |----- |
| review | String |
| rating | Number |
| createdAt | Date |
| order | ref->Order |
| baker | ref->User |
| User | ref->User |

**Order**:
| Attribute | Type |
|---------- |----- |
| product | ref->Product|
| User | ref->User |
| baker | ref-> User |
| quantity | Number|
| createdAt | Date |
| status | String->enum |

### Auth

A simple JWT-based auth mechanism is to be used with passwords

### APIs

### NOTE: A Postman Collection is attached to the code, feel free to use it

**Auth :**

```
/signup                 [POST]
/login                  [POST]
/logout                 [GET]

```

**Products :**

```
/products        [GET]
/products        [POST]
/products/:id    [GET]
/products/:id    [PATCH]
/products/:id    [DELETE]

```

**Users :**:

```
/users/:id                  [GET]
/users/busyTime             [GET]
/users/deleteMe             [DELETE]

```

**Reviews :**:

```
/reviews       [GET]
/reviews       [POST]
/reviews/:id   [GET]
/reviews/:id   [PATCH]
/reviews/:id   [DELETE]

```

**Orders :**:

```
/orders                [GET]
/orders                [POST]
/orders/:id            [GET]
/orders/:id            [PATCH]
/orders/:id            [DELETE]
/orders/buy/:orderId   [DELETE]

```

### Error handling

- AppError class to handle non-existent routes even if not all its methods are used

* Error controller as a global error handler

- Catch Async is used to grab catch block in all async functions

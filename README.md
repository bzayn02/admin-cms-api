# Admin - E-commerce CMS API

This backend API project is created for the e-commerce admin cms panel.

### API end-points

All the api endpoint will be followed by `${rootUrl}/api/v1`

### User API endpoints

All user api endpiont will be follwed by `${rootUrl}/api/v1/user`

| #   | API | METHOD | DESCRIPTION                 |
| --- | --- | ------ | --------------------------- |
| 1.  | `/` | GET    | Get all users               |
| 2.  | `/` | POST   | Create new user in database |

### Catalog API endpoints

All catalog api endpiont will be follwed by `${rootUrl}/api/v1/category`

| #   | API      | METHOD | DESCRIPTION                                                              |
| --- | -------- | ------ | ------------------------------------------------------------------------ |
| 1.  | `/:_id?` | GET    | Get single category if '\_id' is provided, otherwise return all catalogs |
| 2.  | `/`      | POST   | Create new category in database                                          |
| 2.  | `/`      | PATCH  | Update category in database                                              |
| 2.  | `/:_id`  | DELETE | Create new category in database                                          |

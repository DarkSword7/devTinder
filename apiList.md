# DevTinder APIs

## authRoutes:

- POST /signup
- POST /login
- POST /logout

## profileRoutes:

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRoutes:

- POST /request/send/ignored/:userId
- POST /request/send/interested/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## userRoutes:

- GET /user/connections
- GET /user/requests
- GET /user/feed

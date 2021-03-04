# patre-eth

This application is primarily user oriented by design. It makes sense to start
Making this application with a user sign up, login, logout workflow in mind.

As such, we will create routs and pages in this order:

1. homepage at /
2. user sign up at /user/create
3. user login at /user/login
4. user logout at /user/:id/logout
5. user update at /user/:id/update
6. user delete at /user/:id/delete

Which means we should first write tests for our models and databases.

--Check list--
* User Model Tests
* set up database js file
* write user model
* run tests / debug
--now commit--
* write tests for homepage.
* write homepage route
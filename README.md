## Readme Questions
a. How to use your system (both for the web application and with REST API)  
- To use the web application navigate to https://nwen304theconnoisseurs.herokuapp.com/  
- Using the web application is straightforward, and contains a Homepage with a navigation bar that provides links to view all products, log in, register and log in with Google.  
- Once a user is logged in, the navigation bar will replace the links to login/register/login with Google with links to purchase history and log out.
- The products page displays all products in the database, and clicking on a product will take you to the product page.
- The product page displays the product information, and allows you to purchase the product if logged in.
- The purchase history page displays all the products that the user has purchased.
- If the user is authenticated as the admin, with username "admin" and password "admin", the navigation bar will have an additional link to create a new product and individual product pages will have edit and delete buttons visible.

To use the REST API, you can use the following endpoints:
- POST /login - log in with username and password, and receive a JWT token
- The remaining endpoints all require a JWT token to be passed in the header as "Authorization: Bearer <token>"
- POST /products/create - creates a new product
- GET /products - returns all products
- GET /products/:id - returns a single product
- PUT /products/:id - updates a product
- DELETE /products/:id - deletes a product

b. What the interface is (both for the web application and with REST API)  
The interface for the REST API is a JSON object, and the interface for the web application is a webpage.  
The REST API is accessible through a browser or any other HTTP client, and the web application is accessible only through a browser.


c. What error handling has been implemented in your system(both for the web application and with REST API)  
Error handling has been implemented the same for the web application and the REST API, with each database call having .catch blocks to catch any unwanted errors and display them to the user  
Unknown resources are also handled by the server, and will return a 404 error, either as a webpage or JSON object depending on the request type.
Try catch blocks are also used to catch potential errors for synchronous code such as in the sendEmail file/function.  
We also have XSS prevention using Mongoose models and CSRF prevention by using a same-site cookie policy.
# Work Splitting
### Core
- [x] Come up with idea for the site - shitty shopping page
	- [x] Theme - Books, Pens, Umbrella, Clothes, etc
- [ ] Authentication - Tarik - Recent Lectures
	- [ ] OAuth stuffs
- [ ] Database work and stuff + API - Jacob
- [ ] Website design/layout? - Finniann
- [ ] Client side code - Finnnniannn
- [ ] Deploy to server - Isleep

### Completion
- [ ] Performance Testing - Everyone

### Challenge
- [ ] Recommendation service
	- [ ] Use location from browser to recommend umbrella if raining
	- [ ] Make obvious box if the user declines location or if the recommendation is active
- [ ] Password reset
- [ ] Timeout


## Layout
- Home screen of products and login buttons
- Login/signup screens
- Individual product page
- Once authenticated, can view cart and orders
- Admins have separate pages and can create delete update etc products




## Extra Notes
add cart and order history to each user - route: /orders and /cart - should be easy to store the user information in the database and then just use the user id to get the cart and order history
add secret key to the register form and if it is correct, make the user admin
need admin auth to view and access the create, update, delete etc
hide admin buttons if the user is not an admin
should keep track of user purchases or something
- just ask the user for their location and then recommend if raining, easy  
- record colour of the books that a user buys and then choose that colour of umbrella lol



Misc to do
- [ ] Input sanitisation
- [x] Pipeline to deploy to server
- [ ] Add hypermedia links to the responses
- 
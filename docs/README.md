# patre-eth

Link to the docs
http://john-the-fourth.engineer/patre-eth/#/
Link to the deployed application
http://patre-eth.dev.john-the-fourth.engineer/


1. `/` GET Hompage
2. `/user` GET returns info for loged in user
3. `/user/create` GET returns sign up form
4. `/user/create` POST 
requires { username: "", password: "", publicEthAddress: "", email: "" }
5. `/user/update` GET returns a user modification form
6. `/user/update` PUT
requires user to be logged into the one being update { username: "", password: "", publicEthAddress: "", email: "" }
7. `/user/delete` DELETE deletes the logged in user

8. `/user/login` GET gets the login form
9. `/user/login` POST 
requires { username: "", password: "" }

10. `/content/:id` GET Should only be able to be viewed if you created the content or if you have a TxReceipt for the content.
11. `/content/create` GET returns content creation form (form not implemented)
12. `/content/create` POST 
requires user to be logged in { title: "", content: "", priceInWei: "100000" }
13. `/content/:id/update` GET returns content update form (form not implemented)
14. `/content/:id/update` PUT
requires user to be logged in and author of the content { title: "", content: "", priceInWei: "100000" }
15. `/content/:id/delete` DELETE deletes that content if you are the owner

16. `/content/:id/txreceipt/create` GET returns a form for creating a txreceipt (form not implemented)
17. `/content/:id/txreceipt/create` POST
requires user to be logged in { txHash: "" }
txHash must be a valid ethereum transaction hash with a value equal to the 
content's price being sent from your publicEthAddress to the author of the
content's publicEthAddress.


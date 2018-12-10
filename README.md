# nodejs-shopping-cart-system

Using Node,Express,MaterializeCss And MongoDb

Sign UP With Your email And Password Go To MongoDb shopping>users 
and Change The user_type from user to  admin
now You can add Products Edit And Delete Products

I used StripeJs  For The Payment Gateway 

Steps To Integrate Stripejs 

#first 

Go to stripejs official website and Create And Account 

link - https://dashboard.stripe.com/register

then You Will Get Two Keys Public and Secret Key

paste Them As Follow

For Public Key 

go to : public/javascripts/checkout.js

then -> instead of ('Your public Key Here') paste Your Key Public Key 

eg:-> ('hfjshfjhsjfhhv')

For Secret Key

go to : routes/index.js

then -> instead of ('Your Secret Key Here') paste Your Key Secret Key 

eg:-> ('hfjshfjhsjfhhv')



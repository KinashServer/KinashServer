<h1>Where the config located?</h1>
Config.json located at /configs/config.json

<h1>What does "host" means in config.json</h1>
This is a host (ip) of the server 

<h1>What does "port" means in config.json</h1>
This is a port of the server 

<h1>What does "authentication_url" means in config.json</h1>
This is url with basic http auth
This can be used if you want to password protect some page
Use "null" to disable

<h1>What does "authentication_username" means in config.json</h1>
This is the username that will be used in basic http authentication
Set to empty to disable

<h1>What does "authentication_password" means in config.json</h1>
This is the password that will be used in basic http authentication
Set to empty to disable

<h1>What does "authentication_realm" means in config.json</h1>
This is the realm that shown in headers in authentication page

<h1>What does "authentication_file" means in config.json</h1>
This is the authentication file that will be shown after successfully authentication
Must start with ./public_html/
Example: ./public_html/admin.html

<h1>What does "max_url_length" means in config.json</h1>

This is the maximum url length for all pages
Server will return error 414 if the url too long
Tip: Use only numbers in max_url_length to prevent server crash

<h1>What does "error[status code]page" means in config.json</h1>

This is the page code that server will return when occurs [status code] error

<h1>What does "disallowcrawlers" do?</h1>

Disallow accsess from crawlers to your website 

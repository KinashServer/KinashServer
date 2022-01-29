<script>
  document.write(`Configuration help:

<h1>Where the config located?</h1>
Config.json located at /configs/config.json

<h1>What is "host" in config.json</h1>
This is a host (IP) of the server 

<h1>What is  "port" in config.json</h1>
This is a port of the server 

<h1>What is "authentication_url" in config.json</h1>
This is a URL with basic HTTP auth
This can be used if you want to password protect some page
Set to "null" to disable

<h1>What is "authentication_username" in config.json</h1>

This is the username that will be used in basic HTTP authentication
Set to empty to disable

<h1>What does "authentication_password" means in config.json</h1>
This is the password that will be used in basic HTTP authentication
Set to empty to disable

<h1>What does "authentication_realm" means in config.json</h1>
This is the realm that shown in headers in authentication page

<h1>What does "authentication_file" means in config.json</h1>
This is the authentication file that will be shown after successfully authentication
Must start with ./public_html/
Example: ./public_html/admin.html

<h1>What does "max_url_length" means in config.json</h1>

This is the maximum URL length for all pages
Server will return error 414 if the URL too long
TIP: Use only numbers in max_url_length to prevent server crash

<h1>What does "error[status code]page" means in config.json</h1>

This is the page code that server will return when occurs [status code] error

<h1>What does "disallowcrawlers" do?</h1>

Disallow access from crawlers to your website 
`)
</script>
Welcome to documentation of KinashServer

<h1>How to start the server?</h1>

Go to main server directory and run app.js

<h1>What is the link to our github?</h1>

Its <a href="https://github.com/andriy332/KinashServer">https://github.com/andriy332/KinashServer</a>
<br>
<a onclick="confighelp()" href="#./configuration_help.md">Next page: configuration help</a>

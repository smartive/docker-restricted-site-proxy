# restricted site proxy
Based on [node:7.8-onbuild](https://registry.hub.docker.com/_/node/)

## Description
With this image, one can authenticate users to a special proxed site. 
A restricted staging site for any development environment could be a usecase.
You can use the environment variables to configure the proxy server, all the data are proxed.

Disclaimer: by now, I don't know if multipart is supported, as I did not need it now ;-)

## Run configurations

### Default (testing)

```bash
docker run -d -P smartive/restricted-site-proxy
```
This configuration is for testing purposes. It will use the default values of the environment
variables and proxy to google.ch. (hint: user / pass)

### Full example (non ssl)
```bash
docker run -d -p 80:80 -p 443:443 -e PROXY_TARGET="http://maps.google.com" -e PROXY_SITE_USERNAME="secret" -e PROXY_SITE_PASSWORD="password" smartive/restricted-site-proxy
```

### Full example (ssl termination)
```bash
docker run -d -p 80:80 -p 443:443 \
       -e PROXY_TARGET="http://maps.google.com" \
	   -e PROXY_SITE_USERNAME="secret" \
	   -e PROXY_SITE_PASSWORD="password" \
       -e PROXY_SSL_CERT="/ssl/cert.crt" \   
       -e PROXY_SSL_KEY="/ssl/cert.key" \
	   -v $PWD/:/ssl         
	   smartive/restricted-site-proxy
```

## Environment variables

### Proxy

#### PROXY_PORT
The port where the non-ssl proxy part should listen.

Default: *80*

#### PROXY_SSL_PORT
The port where the ssl proxy part should listen. If ssl is activated, all non ssl requests will be redirected to ssl secure site.

Default: *443*

#### PROXY_SSL_CERT
Path to the certificate in the container. May be mounted or copied via Dockerfile.
_If cert and key are set, ssl termination is activated! All non ssl requests will be redirected to ssl requests._

Default: *null*

#### PROXY_SSL_KEY
Path to the certificate-key in the container. May be mounted or copied via Dockerfile.
_If cert and key are set, ssl termination is activated! All non ssl requests will be redirected to ssl requests._

Default: *null*

### Proxy credentials

#### PROXY_SITE_USERNAME
Username that should be used to enter the restriced site.

Default: *user*

#### PROXY_SITE_PASSWORD
Password for the user.

Default: *pass*

### Target site

#### PROXY_TARGET
Restricted target. If PROXY_TARGET_HOST is set, this value will be ignored.

Default: *http://google.ch*

#### PROXY_TARGET_HOST
Restricted target hostname. If PROXY_TARGET_HOST is set, the value of PROXY_TARGET will be ignored.

Default: *null*

#### PROXY_TARGET_PORT
Restricted target port.

Default: *80*

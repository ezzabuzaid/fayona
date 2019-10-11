import hsc = require('http-status-codes');
export const NetworkStatus = hsc;

// HTTP 200 OK: Standard response for successful HTTP requests.
//  The actual response will depend on the request method used.

// HTTP 204 No Content: The server successfully processed the request, but is not returning any content

// HTTP 404 Not Found - The server has not found anything matching the Request-URI.

// HTTP 503 Service Unavailable: The server is currently unable to handle the
//  request due to a temporary overloading or maintenance of the server.

// 406(NOT ACCEPTABLE) is returned by the server when it can't respond based on accepting the request headers
//  (ie they have an Accept header which states they only want XML).

// 415(UNSUPPORTED MEDIA TYPE) is returned by the server when the entity sent in a request
// (content in a POST or PUT) has an unsupported mediatype (i.e. they sent XML).

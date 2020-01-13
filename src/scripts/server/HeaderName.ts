export enum HeaderName {
    /// # Authentication

    /**Defines the authentication method that should be used to access a resource. */
    WWWAuthenticate = 'WWW-Authenticate',
    /**Contains the credentials to authenticate a user-agent with a server. */
    Authorization = 'Authorization',
    /**Defines the authentication method that should be used to access a resource behind a proxy server. */
    ProxyAuthenticate = 'Proxy-Authenticate',
    /**Contains the credentials to authenticate a user agent with a proxy server. */
    ProxyAuthorization = 'Proxy-Authorization',


    /// # Caching

    /**The time, in seconds, that the object has been in a proxy cache. */
    Age = 'Age',
    /**Directives for caching mechanisms in both requests and responses. */
    CacheControl = 'Cache-Control',
    /**Clears browsing data (e.g. cookies, storage, cache) associated with the requesting website. */
    ClearSiteData = 'Clear-Site-Data',
    /** The date/time after which the response is considered stale. */
    Expires = 'Expires',
    /** Implementation-specific header that may have various effects anywhere along the request-response chain. Used for backwards compatibility with HTTP/1.0 caches where the Cache-Control header is not yet present. */
    Pragma = 'Pragma',
    /** General warning information about possible problems. */
    Warning = 'Warning',


    /// # Client hints

    /// HTTP Client hints are a work in progress. Actual documentation can be found on the website of the HTTP working group.
    /** Servers can advertise support for Client Hints using the Accept-CH header field or an equivalent HTML <meta> element with http-equiv attribute ([HTML5]). */
    AcceptCH = 'Accept-CH',
    /** Servers can ask the client to remember the set of Client Hints that the server supports for a specified period of time, to enable delivery of Client Hints on subsequent requests to the server’s origin ([RFC6454]). */
    AcceptCHLifetime = 'Accept-CH-Lifetime',
    /** Indicates that the request has been conveyed in early data. */
    EarlyData = 'Early-Data',
    /** A number that indicates the ratio between physical pixels over CSS pixels of the selected image response. */
    ContentDPR = 'Content-DPR',
    /** A number that indicates the client’s current Device Pixel Ratio (DPR), which is the ratio of physical pixels over CSS pixels (Section 5.2 of [CSSVAL]) of the layout viewport (Section 9.1.1 of [CSS2]) on the device. */
    DPR = 'DPR',
    /** Technically a part of Device Memory API, this header represents an approximate amount of RAM client has. */
    DeviceMemory = 'Device-Memory',
    /** A boolean that indicates the user agent's preference for reduced data usage. */
    SaveData = 'Save-Data',
    /** A number that indicates the layout viewport width in CSS pixels. The provided pixel value is a number rounded to the smallest following integer (i.e. ceiling value). */
    ViewportWidth = 'Viewport-Width',
    /// If Viewport-Width occurs in a message more than once, the last value overrides all previous occurrences.
    /** The Width request header field is a number that indicates the desired resource width in physical pixels (i.e. intrinsic size of an image). The provided pixel value is a number rounded to the smallest following integer (i.e. ceiling value). */
    Width = 'Width',
    /// If the desired resource width is not known at the time of the request or the resource does not have a display width, the Width header field can be omitted. If Width occurs in a message more than once, the last value overrides all previous occurrences


    /// # Conditionals

    /** The last modification date of the resource, used to compare several versions of the same resource. It is less accurate than ETag, but easier to calculate in some environments. Conditional requests using If-Modified-Since and If-Unmodified-Since use this value to change the behavior of the request. */
    LastModified = 'Last-Modified',
    /** A unique string identifying the version of the resource. Conditional requests using If-Match and If-None-Match use this value to change the behavior of the request. */
    ETag = 'ETag',
    /** Makes the request conditional, and applies the method only if the stored resource matches one of the given ETags. */
    IfMatch = 'If-Match',
    /** Makes the request conditional, and applies the method only if the stored resource doesn't match any of the given ETags. This is used to update caches (for safe requests), or to prevent to upload a new resource when one already exists. */
    IfNoneMatch = 'If-None-Match',
    /** Makes the request conditional, and expects the entity to be transmitted only if it has been modified after the given date. This is used to transmit data only when the cache is out of date. */
    IfModifiedSince = 'If-Modified-Since',
    /** Makes the request conditional, and expects the entity to be transmitted only if it has not been modified after the given date. This ensures the coherence of a new fragment of a specific range with previous ones, or to implement an optimistic concurrency control system when modifying existing documents. */
    IfUnmodifiedSince = 'If-Unmodified-Since',
    /** Determines how to match request headers to decide whether a cached response can be used rather than requesting a fresh one from the origin server. */
    Vary = 'Vary',


    /// # Connection management

    /** Controls whether the network connection stays open after the current transaction finishes. */
    Connection = 'Connection',
    /** Controls how long a persistent connection should stay open. */
    KeepAlive = 'Keep-Alive',


    /// # Content negotiation

    /** Informs the server about the types of data that can be sent back. */
    Accept = 'Accept',
    /** Which character encodings the client understands. */
    AcceptCharset = 'Accept-Charset',
    /** The encoding algorithm, usually a compression algorithm, that can be used on the resource sent back. */
    AcceptEncoding = 'Accept-Encoding',
    /** Informs the server about the human language the server is expected to send back. This is a hint and is not necessarily under the full control of the user: the server should always pay attention not to override an explicit user choice (like selecting a language from a dropdown). */
    AcceptLanguage = 'Accept-Language',


    /// # Controls

    /** Indicates expectations that need to be fulfilled by the server to properly handle the request. */
    Expect = 'Expect',
    /**  */
    MaxForwards = 'Max-Forwards',


    /// # Cookies

    /** Contains stored HTTP cookies previously sent by the server with the Set-Cookie header. */
    Cookie = 'Cookie',
    /** Send cookies from the server to the user-agent. */
    SetCookie = 'Set-Cookie',
    /** Contains an HTTP cookie previously sent by the server with the Set-Cookie2 header, but has been obsoleted. Use Cookie instead. */
    Cookie2 = 'Cookie2',
    /** Sends cookies from the server to the user-agent, but has been obsoleted. Use Set-Cookie instead. */
    SetCookie2 = 'Set-Cookie2',


    /// # CORS

    /** Indicates whether the response can be shared. */
    AccessControlAllowOrigin = 'Access-Control-Allow-Origin',
    /** Indicates whether the response to the request can be exposed when the credentials flag is true. */
    AccessControlAllowCredentials = 'Access-Control-Allow-Credentials',
    /** Used in response to a preflight request to indicate which HTTP headers can be used when making the actual request. */
    AccessControlAllowHeaders = 'Access-Control-Allow-Headers',
    /** Specifies the methods allowed when accessing the resource in response to a preflight request. */
    AccessControlAllowMethods = 'Access-Control-Allow-Methods',
    /** Indicates which headers can be exposed as part of the response by listing their names. */
    AccessControlExposeHeaders = 'Access-Control-Expose-Headers',
    /** Indicates how long the results of a preflight request can be cached. */
    AccessControlMaxAge = 'Access-Control-Max-Age',
    /** Used when issuing a preflight request to let the server know which HTTP headers will be used when the actual request is made. */
    AccessControlRequestHeaders = 'Access-Control-Request-Headers',
    /** Used when issuing a preflight request to let the server know which HTTP method will be used when the actual request is made. */
    AccessControlRequestMethod = 'Access-Control-Request-Method',
    /** Indicates where a fetch originates from. */
    Origin = 'Origin',
    /** Specifies origins that are allowed to see values of attributes retrieved via features of the Resource Timing API, which would otherwise be reported as zero due to cross-origin restrictions. */
    TimingAllowOrigin = 'Timing-Allow-Origin',


    /// # Do Not Track

    /** Expresses the user's tracking preference. */
    DNT = 'DNT',
    /** Indicates the tracking status of the corresponding response. */
    Tk = 'Tk',


    /// # Downloads

    /** Indicates if the resource transmitted should be displayed inline (default behavior without the header), or if it should be handled like a download and the browser should present a “Save As” dialog. */
    ContentDisposition = 'Content-Disposition',


    /// # Message body information

    /** The size of the resource, in decimal number of bytes. */
    ContentLength = 'Content-Length',
    /** Indicates the media type of the resource. */
    ContentType = 'Content-Type',
    /** Used to specify the compression algorithm. */
    ContentEncoding = 'Content-Encoding',
    /** Describes the human language(s) intended for the audience, so that it allows a user to differentiate according to the users' own preferred language. */
    ContentLanguage = 'Content-Language',
    /** Indicates an alternate location for the returned data. */
    ContentLocation = 'Content-Location',


    /// # Proxies

    /** Contains information from the client-facing side of proxy servers that is altered or lost when a proxy is involved in the path of the request. */
    Forwarded = 'Forwarded',
    /** Identifies the originating IP addresses of a client connecting to a web server through an HTTP proxy or a load balancer. */
    XForwardedFor = 'X-Forwarded-For',
    /** Identifies the original host requested that a client used to connect to your proxy or load balancer. */
    XForwardedHost = 'X-Forwarded-Host',
    /** Identifies the protocol (HTTP or HTTPS) that a client used to connect to your proxy or load balancer. */
    XForwardedProto = 'X-Forwarded-Proto',
    /** Added by proxies, both forward and reverse proxies, and can appear in the request headers and the response headers. */
    Via = 'Via',


    /// # Redirects

    /** Indicates the URL to redirect a page to. */
    Location = 'Location',


    /// # Request context

    /** Contains an Internet email address for a human user who controls the requesting user agent. */
    From = 'From',
    /** Specifies the domain name of the server (for virtual hosting), and (optionally) the TCP port number on which the server is listening. */
    Host = 'Host',
    /** The address of the previous web page from which a link to the currently requested page was followed. */
    Referer = 'Referer',
    /** Governs which referrer information sent in the Referer header should be included with requests made. */
    ReferrerPolicy = 'Referrer-Policy',
    /** Contains a characteristic string that allows the network protocol peers to identify the application type, operating system, software vendor or software version of the requesting software user agent. See also the Firefox user agent string reference. */
    UserAgent = 'User-Agent',


    /// # Response context

    /** Lists the set of HTTP request methods support by a resource. */
    Allow = 'Allow',
    /** Contains information about the software used by the origin server to handle the request. */
    Server = 'Server',


    /// # Range requests

    /** Indicates if the server supports range requests, and if so in which unit the range can be expressed. */
    AcceptRanges = 'Accept-Ranges',
    /** Indicates the part of a document that the server should return. */
    Range = 'Range',
    /** Creates a conditional range request that is only fulfilled if the given etag or date matches the remote resource. Used to prevent downloading two ranges from incompatible version of the resource. */
    IfRange = 'If-Range',
    /** Indicates where in a full body message a partial message belongs. */
    ContentRange = 'Content-Range',


    /// # Security

    /** Allows a server to declare an embedder policy for a given document. */
    CrossOriginEmbedderPolicy = 'Cross-Origin-Embedder-Policy',
    /** Prevents other domains from opening/controlling a window. */
    CrossOriginOpenerPolicy = 'Cross-Origin-Opener-Policy',
    /** Prevents other domains from reading the response of the resources to which this header is applied. */
    CrossOriginResourcePolicy = 'Cross-Origin-Resource-Policy',
    /** Controls resources the user agent is allowed to load for a given page. */
    ContentSecurityPolicy = 'Content-Security-Policy',
    /** Allows web developers to experiment with policies by monitoring, but not enforcing, their effects. These violation reports consist of JSON documents sent via an HTTP POST request to the specified URI. */
    ContentSecurityPolicyReportOnly = 'Content-Security-Policy-Report-Only',
    /** Allows sites to opt in to reporting and/or enforcement of Certificate Transparency requirements, which prevents the use of misissued certificates for that site from going unnoticed. When a site enables the Expect-CT header, they are requesting that Chrome check that any certificate for that site appears in public CT logs. */
    ExpectCT = 'Expect-CT',
    /** Provides a mechanism to allow and deny the use of browser features in its own frame, and in iframes that it embeds. */
    FeaturePolicy = 'Feature-Policy',
    /** Associates a specific cryptographic public key with a certain web server to decrease the risk of MITM attacks with forged certificates. */
    PublicKeyPins = 'Public-Key-Pins',
    /** Sends reports to the report-uri specified in the header and does still allow clients to connect to the server even if the pinning is violated. */
    PublicKeyPinsReportOnly = 'Public-Key-Pins-Report-Only',
    /** Force communication using HTTPS instead of HTTP. */
    StrictTransportSecurity = 'Strict-Transport-Security',
    /** Sends a signal to the server expressing the client’s preference for an encrypted and authenticated response, and that it can successfully handle the upgrade-insecure-requests directive. */
    UpgradeInsecureRequests = 'Upgrade-Insecure-Requests',
    /** Disables MIME sniffing and forces browser to use the type given in Content-Type. */
    XContentTypeOptions = 'X-Content-Type-Options',
    /** The X-Download-Options HTTP header indicates that the browser (Internet Explorer) should not display the option to "Open" a file that has been downloaded from an application, to prevent phishing attacks as the file otherwise would gain access to execute in the context of the application. (Note: related MS Edge bug). */
    XDownloadOptions = 'X-Download-Options',
    /** Indicates whether a browser should be allowed to render a page in a <frame>, <iframe>, <embed> or <object>. */
    XFrameOptions = 'X-Frame-Options',
    /** Specifies if a cross-domain policy file (crossdomain.xml) is allowed. The file may define a policy to grant clients, such as Adobe's Flash Player, Adobe Acrobat, Microsoft Silverlight, or Apache Flex, permission to handle data across domains that would otherwise be restricted due to the Same-Origin Policy. See the Cross-domain Policy File Specification for more information. */
    XPermittedCrossDomainPolicies = 'X-Permitted-Cross-Domain-Policies',
    /** May be set by hosting environments or other frameworks and contains information about them while not providing any usefulness to the application or its visitors. Unset this header to avoid exposing potential vulnerabilities. */
    XPoweredBy = 'X-Powered-By',
    /** Enables cross-site scripting filtering. */
    XXSSProtection = 'X-XSS-Protection',


    /// # Server-sent events

    /** ... */
    LastEventID = 'Last-Event-ID',
    /** Defines a mechanism that enables developers to declare a network error reporting policy. */
    NEL = 'NEL',
    /** ... */
    PingFrom = 'Ping-From',
    /** ... */
    PingTo = 'Ping-To',
    /** Used to specify a server endpoint for the browser to send warning and error reports to. */
    ReportTo = 'Report-To',


    /// # Transfer coding

    /** Specifies the form of encoding used to safely transfer the entity to the user. */
    TransferEncoding = 'Transfer-Encoding',
    /** Specifies the transfer encodings the user agent is willing to accept. */
    TE = 'TE',
    /** Allows the sender to include additional fields at the end of chunked message. */
    Trailer = 'Trailer',


    /// # WebSockets

    /** ... */
    SecWebSocketKey = 'Sec-WebSocket-Key',
    /** ... */
    SecWebSocketExtensions = 'Sec-WebSocket-Extensions',
    /** ... */
    SecWebSocketAccept = 'Sec-WebSocket-Accept',
    /** ... */
    SecWebSocketProtocol = 'Sec-WebSocket-Protocol',
    /** ... */
    SecWebSocketVersion = 'Sec-WebSocket-Version',


    /// # Other

    /** A client can express the desired push policy for a request by sending an Accept-Push-Policy header field in the request. */
    AcceptPushPolicy = 'Accept-Push-Policy',
    /** A client can send the Accept-Signature header field to indicate intention to take advantage of any available signatures and to indicate what kinds of signatures it supports. */
    AcceptSignature = 'Accept-Signature',
    /** Used to list alternate ways to reach this service. */
    AltSvc = 'Alt-Svc',
    /** Contains the date and time at which the message was originated. */
    Date = 'Date',
    /** Tells the browser that the page being loaded is going to want to perform a large allocation. */
    LargeAllocation = 'Large-Allocation',
    /** The Link entity-header field provides a means for serialising one or more links in HTTP headers. It is semantically equivalent to the HTML <link> element. */
    Link = 'Link',
    /** A Push-Policy defines the server behaviour regarding push when processing a request. */
    PushPolicy = 'Push-Policy',
    /** Indicates how long the user agent should wait before making a follow-up request. */
    RetryAfter = 'Retry-After',
    /** The Signature header field conveys a list of signatures for an exchange, each one accompanied by information about how to determine the authority of and refresh that signature. */
    Signature = 'Signature',
    /** The Signed-Headers header field identifies an ordered list of response header fields to include in a signature. */
    SignedHeaders = 'Signed-Headers',
    /** Communicates one or more metrics and descriptions for the given request-response cycle. */
    ServerTiming = 'Server-Timing',
    /** Used to remove the path restriction by including this header in the response of the Service Worker script. */
    ServiceWorkerAllowed = 'Service-Worker-Allowed',
    /** Links generated code to a source map. */
    SourceMap = 'SourceMap',
    /** The relevant RFC document for the Upgrade header field is RFC 7230, section 6.7. The standard establishes rules for upgrading or changing to a different protocol on the current client, server, transport protocol connection. For example, this header standard allows a client to change from HTTP 1.1 to HTTP 2.0, assuming the server decides to acknowledge and implement the Upgrade header field. Neither party is required to accept the terms specified in the Upgrade header field. It can be used in both client and server headers. If the Upgrade header field is specified, then the sender MUST also send the Connection header field with the upgrade option specified. For details on the Connection header field please see section 6.1 of the aforementioned RFC. */
    Upgrade = 'Upgrade',
    /** Controls DNS prefetching, a feature by which browsers proactively perform domain name resolution on both links that the user may choose to follow as well as URLs for items referenced by the document, including images, CSS, JavaScript, and so forth. */
    XDNSPrefetchControl = 'X-DNS-Prefetch-Control',
    /** ... */
    XFirefoxSpdy = 'X-Firefox-Spdy',
    /** ... */
    XPingback = 'X-Pingback',
    /** ... */
    XRequestedWith = 'X-Requested-With',
    /** The X-Robots-Tag HTTP header is used to indicate how a web page is to be indexed within public search engine results. The header is effectively equivalent to <meta name="robots" content="...">. */
    XRobotsTag = 'X-Robots-Tag',
    /** Used by Internet Explorer to signal which document mode to use. */
    XUACompatible = 'X-UA-Compatible',
}
use fastly::http::{header, Body, HeaderValue, Method, StatusCode};
use fastly::{Error, Request, Response};
use include_dir::{include_dir, Dir};

#[fastly::main]
fn main(mut req: Request) -> Result<Response, Error> {
    // Used later to generate CORS headers.
    // Usually you would want an allowlist of domains here, but this example allows any origin to make requests.
    let allowed_origins = match req.get_header(header::ORIGIN) {
        Some(val) => val.clone(),
        _ => HeaderValue::from_static("*"),
    };

    // Respond to CORS preflight requests.
    if req.get_method() == Method::OPTIONS
        && req.contains_header(header::ORIGIN)
        && (req.contains_header(header::ACCESS_CONTROL_REQUEST_HEADERS)
            || req.contains_header(header::ACCESS_CONTROL_REQUEST_METHOD))
    {
        return Ok(create_cors_response(allowed_origins));
    }

    // Only permit GET requests.
    if req.get_method() != Method::GET {
        return Ok(Response::from_body("Method not allowed")
            .with_status(StatusCode::METHOD_NOT_ALLOWED)
            .with_header(
                header::ALLOW,
                format!("{}, {}", Method::GET, Method::OPTIONS),
            ));
    }

    // Respond to requests for robots.txt.
    if req.get_path() == "/robots.txt" {
        return Ok(Response::from_body("User-agent: *\nAllow: /\n")
            .with_content_type(fastly::mime::TEXT_PLAIN));
    }

    // Append index.html if path is a directory.
    if req.get_path().ends_with('/') {
        req.set_path(&format!("{}index.html", req.get_path()));
    }

    // Remove the query string to improve cache hit ratio.
    req.remove_query();

    let mut beresp = get_static_content(req.get_path().to_owned());

    // The following headers should only be added to HTML responses.
    if let Some(header) = beresp.get_header(header::CONTENT_TYPE) {
        if header.to_str().unwrap().starts_with("text/html") {
            // Apply referrer-policy and HSTS to HTML pages.
            beresp.set_header(header::REFERRER_POLICY, "origin-when-cross-origin");
            beresp.set_header(header::STRICT_TRANSPORT_SECURITY, "max-age=2592000");

            // Apply Access-Control-Allow-Origin to allow cross-origin resource sharing.
            beresp.set_header(header::ACCESS_CONTROL_ALLOW_ORIGIN, allowed_origins);
        }
    }

    beresp.set_header("X-Compress-Hint", "on");

    // Return the backend response to the client.
    Ok(beresp)
}

/// Create a response to a CORS preflight request.
fn create_cors_response(allowed_origins: HeaderValue) -> Response {
    Response::from_status(StatusCode::NO_CONTENT)
        .with_header(header::ACCESS_CONTROL_ALLOW_ORIGIN, allowed_origins)
        .with_header(
            header::ACCESS_CONTROL_ALLOW_METHODS,
            "GET,HEAD,POST,OPTIONS",
        )
        .with_header(header::ACCESS_CONTROL_MAX_AGE, "86400")
        .with_header(header::CACHE_CONTROL, "public, max-age=86400")
}

fn get_static_content(path: String) -> Response {
    let fmtd_path = path
        .char_indices()
        .next()
        .and_then(|(i, _)| path.get(i + 1..))
        .unwrap_or("");

    const PROJECT_DIR: Dir = include_dir!("../build/");

    let mut body = Body::new();

    if let Some(file) = PROJECT_DIR.get_file(fmtd_path) {
        body.write_bytes(file.contents());
        let mut beresp = Response::from_status(StatusCode::OK);
        beresp.append_body(body);
        beresp.append_header(
            "content-type",
            mime_guess::from_path(fmtd_path)
                .first_or_octet_stream()
                .as_ref(),
        );

        println!("Serving: {}", fmtd_path);

        beresp
    } else {

        get_static_content("/index.html".to_string())

        // println!("Couldnt find {}.", fmtd_path);

        // let mut beresp = Response::from_status(StatusCode::NOT_FOUND);
        // body.write_str(&format!("Could not find {}", fmtd_path));
        // beresp.append_body(body);
        // beresp
    }
}

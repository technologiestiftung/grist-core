![](https://img.shields.io/badge/Built%20with%20%E2%9D%A4%EF%B8%8F-at%20Technologiestiftung%20Berlin-blue)

# Grist @ CityLAB Berlin

First, a note: I've had to make some changes for local development:

1. Following the instructions in "Building from source" created a directory `/sandbox_venv3`. I've had to add this to the `.gitignore`
2. For some reason the app crashed initially after following the installation instructions. After some digging I've found that `yarn add @gristlabs/sqlite3` resolved this. Don't ask me why.
3. Building the app created two files `grist-sessions.db` and `landing.db`, starting it created several `*.grist` DB files. Presumably these should be added to the `.gitignore` as well.

## Start development

Use `yarn start` to startup a dev server at <http://localhost:8484>.

## Our modifications of Grist

This fork of `grist-core` modifies the original software in the following ways:

- UI text is changed (from English to German)
- elements that are connected to the commercial Grist product are removed (such as links to the pricing page of Grist)
- color and branding changes

### Keeping our fork in sync

Grist is currently in very active development, so we need to make sure that we periodically update our fork to receive the latest patches and features.

**Recommended workflow:**

1. Make sure you have the upstream repository [configured as a remote](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/configuring-a-remote-for-a-fork). Then fetch it via `git fetch upstream`
2. Create a new branch for the upstream sync: `git checkout -b chore/sync-with-upstream`
3. Merge upstream into the new branch: `git merge upstream/{main|master}`
4. Fix potential merge conflicts. Because we've made some adjustments, merge conflicts might occur. In that case you will have to decide on a per case basis, which changes will persist. We've mostly made changes to the UI texts (English -> German), so if a bigger upstream change affects the text rendering, we should probably accept the changes of upstream and update our text changes afterwards. The same goes for CSS: first accept the upstream changes and then replace the relevant parts with our updated CSS variable values again.

> In the future we could improve some of our customization flow according to [Grist's recommendations](https://support.getgrist.com/self-managed/#customization). This won't work for text changes since text content is mostly hard-coded into Grist.

---

_Original README below:_

## Grist

Grist is a modern relational spreadsheet. It combines the flexibility of a spreadsheet with the
robustness of a database to organize your data and make you more productive.

https://user-images.githubusercontent.com/118367/151245587-892e50a6-41f5-4b74-9786-fe3566f6b1fb.mp4

## Features

(By popular request: we have a specific write-up of [Grist vs Airtable](https://www.getgrist.com/blog/grist-v-airtable/) that may be helpful).
Grist is a hybrid database/spreadsheet, meaning that:

- Columns work like they do in databases. They are named, and hold one kind of data.
- Columns can be filled by formula, spreadsheet-style, with automatic updates when referenced cells change.

Here are some specific feature highlights of Grist:

  * Python formulas.
    - Full [Python syntax is supported](https://support.getgrist.com/formulas/#python), and the standard library.
    - Many [Excel functions](https://support.getgrist.com/functions/) also available.
  * A portable, self-contained format.
    - Based on SQLite, the most widely deployed database engine.
    - Any tool that can read SQLite can read numeric and text data from a Grist file.
    - Great format for [backups](https://support.getgrist.com/exports/#backing-up-an-entire-document) that you can be confident you can restore in full.
    - Great format for moving between different hosts.
  * Convenient editing and formatting features.
    - Choices and [choice lists](https://support.getgrist.com/col-types/#choice-list-columns), for adding colorful tags to records without fuss.
    - [References](https://support.getgrist.com/col-refs/#creating-a-new-reference-list-column) and reference lists, for cross-referencing records in other tables.
    - [Attachments](https://support.getgrist.com/col-types/#attachment-columns), to include media or document files in records.
    - Dates and times, toggles, and special numerics such as currency all have specialized editors and formatting options.
    - [Conditional Formatting](https://support.getgrist.com/conditional-formatting/), letting you control the style of cells with formulas, to draw attention to important information.
  * Great for dashboards, visualizations, and data entry.
    - [Charts](https://support.getgrist.com/widget-chart/) for visualization.
    - [Summary tables](https://support.getgrist.com/summary-tables/) for summing and counting across groups.
    - [Widget linking](https://support.getgrist.com/linking-widgets/) streamlines filtering and editing data.
    Grist has a unique approach to visualization, where you can lay out and link distinct widgets to show together,
    without cramming mixed material into a table.
    - The [Filter bar](https://support.getgrist.com/search-sort-filter/#filter-buttons) is great for quick slicing and dicing.
  * [Incremental imports](https://support.getgrist.com/imports/#updating-existing-records).
    - So you can import a CSV of the last three months activity from your bank...
    - ... and import new activity a month later without fuss or duplicates.
  * Integrations.
    - A [REST API](https://support.getgrist.com/api/), [Zapier actions/triggers](https://support.getgrist.com/integrators/#integrations-via-zapier), and support from similar [integrators](https://support.getgrist.com/integrators/).
    - Import/export to Google drive, Excel format, CSV.
    - Can link data with custom widgets hosted externally.
  * [Many templates](https://templates.getgrist.com/) to get you started, from investment research to organizing treasure hunts.
  * Access control options.
    - (You'll need SSO logins set up to make use of these options)
    - Share [individual documents](https://support.getgrist.com/sharing/), or workspaces, or [team sites](https://support.getgrist.com/team-sharing/).
    - Control access to [individual rows, columns, and tables](https://support.getgrist.com/access-rules/).
    - Control access based on cell values and user attributes.
  * Can be self-maintained.
    - Useful for intranet operation and specific compliance requirements.
  * Sandboxing options for untrusted documents.
    - On Linux or with docker, you can enable
      [gVisor](https://github.com/google/gvisor) sandboxing at the individual
      document level.
    - On OSX, you can use native sandboxing.

If you are curious about where Grist is going heading,
see [our roadmap](https://github.com/gristlabs/grist-core/projects/1), drop a
question in [our forum](https://community.getgrist.com),
or browse [our extensive documentation](https://support.getgrist.com).

## Using Grist

There are docker images set up for individual use, or (with some
configuration) for self-hosting. Grist Labs offers a hosted service
at [docs.getgrist.com](https://docs.getgrist.com).

To get Grist running on your computer with [Docker](https://www.docker.com/get-started), do:

```sh
docker pull gristlabs/grist
docker run -p 8484:8484 -it gristlabs/grist
```

Then visit `http://localhost:8484` in your browser. You'll be able to create, edit, import,
and export documents. To preserve your work across docker runs, share a directory as `/persist`:

```sh
docker run -p 8484:8484 -v $PWD/persist:/persist -it gristlabs/grist
```

Get templates at [templates.getgrist.com](https://templates.getgrist.com) for payroll,
inventory management, invoicing, D&D encounter tracking, and a lot
more, or use any document you've created on
[docs.getgrist.com](https://docs.getgrist.com).

If you need to change the port Grist runs on, set a `PORT` variable, don't just change the
port mapping:

```
docker run --env PORT=9999 -p 9999:9999 -v $PWD/persist:/persist -it gristlabs/grist
```

To enable gVisor sandboxing, set `--env GRIST_SANDBOX_FLAVOR=gvisor`.
This should work with default docker settings, but may not work in all
environments.

You can find a lot more about configuring Grist, setting up authentication,
and running it on a public server in our
[Self-Managed Grist](https://support.getgrist.com/self-managed/) handbook.

## Building from source

To build Grist from source, follow these steps:

    yarn install
    yarn run build:prod
    yarn run install:python
    yarn start
    # Grist will be available at http://localhost:8484/

Grist formulas in documents will be run using Python executed directly on your
machine. You can configure sandboxing using a `GRIST_SANDBOX_FLAVOR`
environment variable.

 * On OSX, `export GRIST_SANDBOX_FLAVOR=macSandboxExec`
   uses the native `sandbox-exec` command for sandboxing.
 * On Linux with [gVisor's runsc](https://github.com/google/gvisor)
   installed, `export GRIST_SANDBOX_FLAVOR=gvisor` is an option.

These sandboxing methods have been written for our own use at Grist Labs and
may need tweaking to work in your own environment - pull requests
very welcome here!

## Logins

Like git, Grist has features to track document revision history. So for full operation,
Grist expects to know who the user modifying a document is. Until it does, it operates
in a limited anonymous mode. To get you going, the docker image is configured so that
when you click on the "sign in" button Grist will attribute your work to `you@example.com`.
Change this by setting `GRIST_DEFAULT_EMAIL`:

```
docker run --env GRIST_DEFAULT_EMAIL=my@email -p 8484:8484 -v $PWD/persist:/persist -it gristlabs/grist
```

You can change your name in `Profile Settings` in
the [User Menu](https://support.getgrist.com/glossary/#user-menu).

For multi-user operation, or if you wish to access Grist across the
public internet, you'll want to connect it to your own Single Sign-On service.
There are a lot of ways to do this, including [SAML and forward authentication](https://support.getgrist.com/self-managed/#how-do-i-set-up-authentication).
Grist has been tested with [Authentik](https://goauthentik.io/), [Auth0](https://auth0.com/),
and Google/Microsoft sign-ins via [Dex](https://dexidp.io/).

## Why free and open source software

This repository, [grist-core](https://github.com/gristlabs/grist-core), is maintained by Grist
Labs. Our flagship product available at [getgrist.com](https://www.getgrist.com) is built from the code you see
here, combined with business-specific software designed to scale it to many users, handle billing,
etc.

Grist Labs is an open-core company. We offer Grist hosting as a
service, with free and paid plans. We also develop and sell
features related to Grist using a proprietary license, targeted at the
needs of enterprises with large self-managed installations. We see
data portability and autonomy as a key value Grist can bring to our
users, and `grist-core` as an essential means to deliver that. We are
committed to maintaining and improving the `grist-core` codebase, and
to be thoughtful about how proprietary offerings impact data portability
and autonomy.

By opening its source code and offering an [OSI](https://opensource.org/)-approved free license,
Grist benefits its users:

- **Developer community.** The freedom to examine source code, make bug fixes, and develop
  new features is a big deal for a general-purpose spreadsheet-like product, where there is a
  very long tail of features vital to someone somewhere.
- **Increased trust.** Because anyone can examine the source code, &ldquo;security by obscurity&rdquo; is not
  an option. Vulnerabilities in the code can be found by others and reported before they cause
  damage.
- **Independence.** Grist is available to you regardless of the fortunes of the Grist Labs business,
  since it is open source and can be self-hosted. Using our hosted solution is convenient, but you
  are not locked in.
- **Price flexibility.** If you are low on funds but have time to invest, self-hosting is a great
  option to have. And DIY users may have the technical savvy and motivation to delve in and make improvements,
  which can benefit all users of Grist.
- **Extensibility.** For developers, having the source open makes it easier to build extensions (such as the
  experimental [Custom Widget](https://support.getgrist.com/widget-custom/)). You can more easily
  include Grist in your pipeline. And if a feature is missing, you can just take the source code and
  build on top of it.

## Reviews

- [Grist on ProductHunt](https://www.producthunt.com/posts/grist-2)
- [Grist on AppSumo](https://appsumo.com/products/grist/) (life-time deal is sold out)
- [Capterra](https://www.capterra.com/p/232821/Grist/#reviews), [G2](https://www.g2.com/products/grist/reviews), [TrustRadius](https://www.trustradius.com/products/grist/reviews)

## Environment variables

Grist can be configured in many ways. Here are the main environment variables it is sensitive to:

Variable | Purpose
-------- | -------
ALLOWED_WEBHOOK_DOMAINS | comma-separated list of permitted domains to use in webhooks (e.g. webhook.site,zapier.com)
APP_DOC_URL | doc worker url, set when starting an individual doc worker (other servers will find doc worker urls via redis)
APP_HOME_URL | url prefix for home api (home and doc servers need this)
APP_STATIC_URL | url prefix for static resources
APP_STATIC_INCLUDE_CUSTOM_CSS | set to "true" to include custom.css (from APP_STATIC_URL) in static pages
APP_UNTRUSTED_URL   | URL at which to serve/expect plugin content.
GRIST_ADAPT_DOMAIN | set to "true" to support multiple base domains (careful, host header should be trustworthy)
GRIST_APP_ROOT      | directory containing Grist sandbox and assets (specifically the sandbox and static subdirectories).
GRIST_BACKUP_DELAY_SECS | wait this long after a doc change before making a backup
GRIST_DATA_DIR      | directory in which to store document caches.
GRIST_DEFAULT_EMAIL | if set, login as this user if no other credentials presented
GRIST_DEFAULT_PRODUCT  | if set, this controls enabled features and limits of new sites. See names of PRODUCTS in Product.ts.
GRIST_DEFAULT_LOCALE  | Locale to use as fallback when Grist cannot honour the browser locale.
GRIST_DOMAIN        | in hosted Grist, Grist is served from subdomains of this domain.  Defaults to "getgrist.com".
GRIST_EXPERIMENTAL_PLUGINS | enables experimental plugins
GRIST_HIDE_UI_ELEMENTS | comma-separated list of parts of the UI to hide. Allowed names of parts: `helpCenter,billing,templates,multiSite,multiAccounts`
GRIST_HOME_INCLUDE_STATIC | if set, home server also serves static resources
GRIST_HOST          | hostname to use when listening on a port.
GRIST_ID_PREFIX | for subdomains of form o-*, expect or produce o-${GRIST_ID_PREFIX}*.
GRIST_IGNORE_SESSION | if set, Grist will not use a session for authentication.
GRIST_INST_DIR      | path to Grist instance configuration files, for Grist server.
GRIST_MANAGED_WORKERS | if set, Grist can assume that if a url targeted at a doc worker returns a 404, that worker is gone
GRIST_MAX_UPLOAD_ATTACHMENT_MB | max allowed size for attachments (0 or empty for unlimited).
GRIST_MAX_UPLOAD_IMPORT_MB | max allowed size for imports (except .grist files) (0 or empty for unlimited).
GRIST_ORG_IN_PATH | if true, encode org in path rather than domain
GRIST_PAGE_TITLE_SUFFIX | a string to append to the end of the `<title>` in HTML documents. Defaults to `" - Grist"`. Set to `_blank` for no suffix at all.
GRIST_PROXY_AUTH_HEADER | header which will be set by a (reverse) proxy webserver with an authorized users' email. This can be used as an alternative to a SAML service. See also GRIST_FORWARD_AUTH_HEADER.
GRIST_ROUTER_URL | optional url for an api that allows servers to be (un)registered with a load balancer
GRIST_SERVE_SAME_ORIGIN | set to "true" to access home server and doc workers on the same protocol-host-port as the top-level page, same as for custom domains (careful, host header should be trustworthy)
GRIST_SESSION_COOKIE | if set, overrides the name of Grist's cookie
GRIST_SESSION_DOMAIN | if set, associates the cookie with the given domain - otherwise defaults to GRIST_DOMAIN
GRIST_SESSION_SECRET | a key used to encode sessions
GRIST_FORCE_LOGIN    | when set to 'true' disables anonymous access
GRIST_SINGLE_ORG | set to an org "domain" to pin client to that org
GRIST_SUPPORT_ANON | if set to 'true', show UI for anonymous access (not shown by default)
GRIST_THROTTLE_CPU | if set, CPU throttling is enabled
GRIST_USER_ROOT     | an extra path to look for plugins in.
COOKIE_MAX_AGE      | session cookie max age, defaults to 90 days; can be set to "none" to make it a session cookie
HOME_PORT           | port number to listen on for REST API server; if set to "share", add API endpoints to regular grist port.
PORT                | port number to listen on for Grist server
REDIS_URL           | optional redis server for browser sessions and db query caching

Sandbox related variables:

| Variable                   | Purpose                                                                                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GRIST_SANDBOX_FLAVOR       | can be pynbox, unsandboxed, docker, or macSandboxExec. If set, forces Grist to use the specified kind of sandbox.                                      |
| GRIST_SANDBOX              | a program or image name to run as the sandbox. See NSandbox.ts for nerdy details.                                                                      |
| PYTHON_VERSION             | can be 2 or 3. If set, documents without an engine setting are assumed to use the specified version of python. Not all sandboxes support all versions. |
| PYTHON_VERSION_ON_CREATION | can be 2 or 3. If set, newly created documents have an engine setting set to python2 or python3. Not all sandboxes support all versions.               |

Forward authentication variables:

Variable | Purpose
-------- | -------
GRIST_FORWARD_AUTH_HEADER | if set, trust the specified header (e.g. "x-forwarded-user") to contain authorized user emails, and enable "forward auth" logins.
GRIST_FORWARD_AUTH_LOGIN_PATH | if GRIST_FORWARD_AUTH_HEADER is set, Grist will listen at this path for logins. Defaults to `/auth/login`.
GRIST_FORWARD_AUTH_LOGOUT_PATH | if GRIST_FORWARD_AUTH_HEADER is set, Grist will forward to this path when user logs out.

When using forward authentication, you may wish to also set the following variables:

  * GRIST_FORCE_LOGIN=true to disable anonymous access.
  * GRIST_IGNORE_SESSION=true to ignore any user identity information in a cookie.
    Only do this if you use forward authentication on all paths.
    You may not want to use forward authentication on all paths if it makes
    signing in required, and you are trying to permit anonymous access.

GRIST_FORWARD_AUTH_HEADER is similar to GRIST_PROXY_AUTH_HEADER, but enables
a login system (assuming you have some forward authentication set up).

Google Drive integrations:

| Variable             | Purpose                                                                              |
| -------------------- | ------------------------------------------------------------------------------------ |
| GOOGLE_CLIENT_ID     | set to the Google Client Id to be used with Google API client                        |
| GOOGLE_CLIENT_SECRET | set to the Google Client Secret to be used with Google API client                    |
| GOOGLE_API_KEY       | set to the Google API Key to be used with Google API client (accessing public files) |
| GOOGLE_DRIVE_SCOPE   | set to the scope requested for Google Drive integration (defaults to drive.file)     |

Database variables:

| Variable         | Purpose                                                          |
| ---------------- | ---------------------------------------------------------------- |
| TYPEORM_DATABASE | database filename for sqlite or database name for other db types |
| TYPEORM_HOST     | host for db                                                      |
| TYPEORM_LOGGING  | set to 'true' to see all sql queries                             |
| TYPEORM_PASSWORD | password to use                                                  |
| TYPEORM_PORT     | port number for db if not the default for that db type           |
| TYPEORM_TYPE     | set to 'sqlite' or 'postgres'                                    |
| TYPEORM_USERNAME | username to connect as                                           |

Testing:

| Variable                | Purpose                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------ |
| GRIST_TESTING_SOCKET    | a socket used for out-of-channel communication during tests only.                    |
| GRIST_TEST_HTTPS_OFFSET | if set, adds https ports at the specified offset. This is useful in testing.         |
| GRIST_TEST_SSL_CERT     | if set, contains filename of SSL certificate.                                        |
| GRIST_TEST_SSL_KEY      | if set, contains filename of SSL private key.                                        |
| GRIST_TEST_LOGIN        | allow fake unauthenticated test logins (suitable for dev environment only).          |
| GRIST_TEST_ROUTER       | if set, then the home server will serve a mock version of router api at /test/router |

## License

This repository, `grist-core`, is released under the [Apache License, Version
2.0](http://www.apache.org/licenses/LICENSE-2.0), which is an
[OSI](https://opensource.org/)-approved free software license.
See LICENSE.txt and NOTICE.txt for more information.
If you have received a version of Grist with an `ext` directory,
the material within it is separately licensed.

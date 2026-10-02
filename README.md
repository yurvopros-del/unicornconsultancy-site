# Unicorn Consultancy Sàrl

Static, dependency-free landing page. Public files are authored at the repository root; the Pages workflow stages only the four HTML pages, stylesheet, SVG asset, CNAME and `.nojekyll`.

## Preview

Serve the repository with any static HTTP server and open `index.html`. No build or JavaScript is required. All internal paths are relative, so the site works at a GitHub Pages project URL and a custom domain.

## Deployment boundary

- Repository: `yurvopros-del/unicornconsultancy-site`.
- Deploy `main` through GitHub Actions; enable Pages with build type `workflow`.
- First verify `https://yurvopros-del.github.io/unicornconsultancy-site/` and all three policy pages.
- `CNAME` contains `www.unicornconsultancy.ch` as the intended future hostname. GitHub Actions does not configure the custom domain from this file. The Pages custom-domain setting is deliberately left unset for temporary-URL proof.
- A later, separately authorized cutover must set the Pages custom domain before changing web DNS records. Enforce HTTPS once GitHub issues the custom-domain certificate.
- No DNS, nameserver, Infomaniak, MX, SPF or TXT changes are part of this repository deployment.
- Do not modify `yurvopros-del/theverdicosite`.

## Content basis

Company identity and operating-role copy are based on the supplied written brief. The referenced partner deck and company-register extract were not provided in this workspace. No contact email, performance claims, licenses or transaction examples have been invented. Company enquiries use the supplied postal address.

The site includes no forms, cookies, browser storage, analytics, external font requests or client-side scripts. The privacy notice identifies GitHub Pages hosting and its documented IP logging.

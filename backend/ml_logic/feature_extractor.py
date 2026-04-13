import re
from urllib.parse import urlparse
import tldextract

def extract_features(url):
    """
    Extract features from a URL for the phishing detection model.
    Matches the schema of phishing_urls_raw.csv
    """
    parsed_url = urlparse(url)
    hostname = parsed_url.hostname or ""
    path = parsed_url.path or ""
    query = parsed_url.query or ""
    
    # Basic Counts
    features = {
        "NumDots": url.count("."),
        "SubdomainLevel": len(tldextract.extract(url).subdomain.split(".")) if tldextract.extract(url).subdomain else 0,
        "PathLevel": len([p for p in path.split("/") if p]),
        "UrlLength": len(url),
        "NumDash": url.count("-"),
        "NumDashInHostname": hostname.count("-"),
        "AtSymbol": 1 if "@" in url else 0,
        "TildeSymbol": 1 if "~" in url else 0,
        "NumUnderscore": url.count("_"),
        "NumPercent": url.count("%"),
        "NumQueryComponents": len(query.split("&")) if query else 0,
        "NumAmpersand": url.count("&"),
        "NumHash": url.count("#"),
        "NumNumericChars": sum(c.isdigit() for c in url),
        "NoHttps": 1 if parsed_url.scheme != "https" else 0,
        "RandomString": 0, # Simplified
        "IpAddress": 1 if re.match(r"\d+\.\d+\.\d+\.\d+", hostname) else 0,
        "DomainInSubdomains": 0, # Simplified
        "DomainInPaths": 0, # Simplified
        "HttpsInHostname": 1 if "https" in hostname else 0,
        "HostnameLength": len(hostname),
        "PathLength": len(path),
        "QueryLength": len(query),
        "DoubleSlashInPath": 1 if "//" in path else 0,
        "NumSensitiveWords": 0, # To be improved with a list
        "EmbeddedBrandName": 0, # Simplified
    }
    
    # Sensitive words list
    sensitive_words = ["login", "verify", "secure", "account", "update", "payment", "banking", "service", "confirm"]
    features["NumSensitiveWords"] = sum(1 for word in sensitive_words if word in url.lower())

    # Brand names detection (Mock implementation)
    brands = ["paypal", "google", "apple", "microsoft", "amazon", "netflix", "facebook", "twitter", "instagram"]
    domain = tldextract.extract(url).domain
    features["EmbeddedBrandName"] = 1 if any(brand in url.lower() and brand != domain for brand in brands) else 0

    # Fill remaining features with default 0s if they are not easily extractable without scraping
    # These match the phishing_urls_raw.csv exactly
    remaining_features = [
        "PctExtHyperlinks", "PctExtResourceUrls", "ExtFavicon", "InsecureForms",
        "RelativeFormAction", "ExtFormAction", "AbnormalFormAction",
        "PctNullSelfRedirectHyperlinks", "FrequentDomainNameMismatch",
        "FakeLinkInStatusBar", "RightClickDisabled", "PopUpWindow",
        "SubmitInfoToEmail", "IframeOrFrame", "MissingTitle", "ImagesOnlyInForm",
        "SubdomainLevelRT", "UrlLengthRT", "PctExtResourceUrlsRT",
        "AbnormalExtFormActionR", "ExtMetaScriptLinkRT", "PctExtNullSelfRedirectHyperlinksRT"
    ]
    
    for rf in remaining_features:
        features[rf] = 0

    # Ensure correct order (matching the model's expected input)
    # List of 48 features in order from phishing_urls_raw.csv
    feature_order = [
        "NumDots", "SubdomainLevel", "PathLevel", "UrlLength", "NumDash", "NumDashInHostname", 
        "AtSymbol", "TildeSymbol", "NumUnderscore", "NumPercent", "NumQueryComponents", 
        "NumAmpersand", "NumHash", "NumNumericChars", "NoHttps", "RandomString", "IpAddress", 
        "DomainInSubdomains", "DomainInPaths", "HttpsInHostname", "HostnameLength", 
        "PathLength", "QueryLength", "DoubleSlashInPath", "NumSensitiveWords", 
        "EmbeddedBrandName", "PctExtHyperlinks", "PctExtResourceUrls", "ExtFavicon", 
        "InsecureForms", "RelativeFormAction", "ExtFormAction", "AbnormalFormAction", 
        "PctNullSelfRedirectHyperlinks", "FrequentDomainNameMismatch", "FakeLinkInStatusBar", 
        "RightClickDisabled", "PopUpWindow", "SubmitInfoToEmail", "IframeOrFrame", 
        "MissingTitle", "ImagesOnlyInForm", "SubdomainLevelRT", "UrlLengthRT", 
        "PctExtResourceUrlsRT", "AbnormalExtFormActionR", "ExtMetaScriptLinkRT", 
        "PctExtNullSelfRedirectHyperlinksRT"
    ]
    
    return [features.get(f, 0) for f in feature_order], features

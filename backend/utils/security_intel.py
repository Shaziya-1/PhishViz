import whois
import socket
import ssl
from datetime import datetime
from urllib.parse import urlparse

TRUSTED_DOMAINS = {
    "google.com", "www.google.com", "gmail.com", "google.co.in",
    "microsoft.com", "office.com", "outlook.com",
    "paypal.com", "www.paypal.com",
    "amazon.com", "aws.amazon.com",
    "apple.com", "icloud.com",
    "facebook.com", "instagram.com",
    "github.com", "gitlab.com",
    "linkedin.com", "twitter.com", "x.com"
}

def is_trusted_domain(url):
    try:
        domain = urlparse(url).netloc.lower()
        if not domain:
            domain = urlparse("https://" + url).netloc.lower()
        
        # Remove port if exists
        domain = domain.split(":")[0]
        
        # Check direct or subdomain (simplified)
        if domain in TRUSTED_DOMAINS:
            return True
        for trusted in TRUSTED_DOMAINS:
            if domain.endswith("." + trusted):
                return True
        return False
    except:
        return False

def get_whois_info(url):
    """
    Get WHOIS registration data
    """
    try:
        domain = urlparse(url).netloc.lower()
        if not domain: domain = urlparse("https://" + url).netloc.lower()
        if not domain: domain = url
        
        w = whois.whois(domain)
        creation_date = w.creation_date
        if isinstance(creation_date, list): creation_date = creation_date[0]
        
        age_days = (datetime.now() - creation_date).days if creation_date else 365 # Default to 1 year if unknown
        return {
            "registrar": w.registrar or "Unknown",
            "creation_date": creation_date.strftime("%Y-%m-%d") if creation_date else "Unknown",
            "age_days": age_days,
            "is_new": age_days < 180
        }
    except Exception:
        return {"registrar": "Unknown", "creation_date": "Unknown", "age_days": 1000, "is_new": False} # Default to old for safety

def check_ssl(url):
    """
    Verify SSL certificate
    """
    try:
        hostname = urlparse(url).hostname
        if not hostname:
            hostname = urlparse("https://" + url).hostname
        
        if not hostname:
            hostname = url

        context = ssl.create_default_context()
        with socket.create_connection((hostname, 443), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                expiry_str = cert['notAfter']
                expiry_date = datetime.strptime(expiry_str, '%b %d %H:%M:%S %Y %Z')
                return {
                    "valid": True,
                    "expiry": expiry_date.strftime("%Y-%m-%d"),
                    "issuer": dict(x[0] for x in cert['issuer'])['commonName']
                }
    except:
        return {"valid": False, "expiry": "Unknown", "issuer": "None"}

def check_dns(url):
    """
    Check DNS records
    """
    try:
        hostname = urlparse(url).hostname
        ip_list = socket.gethostbyname_ex(hostname)[2]
        return {"has_dns": True, "ips": ip_list}
    except:
        return {"has_dns": False, "ips": []}

def check_threat_apis(url):
    """
    Mocking Google Safe Browsing and VirusTotal
    """
    # In practice, we'd make API calls here
    # Return mock responses for demonstration
    phishing_list = ["evil-site.com", "fake-paypal.net", "win-prizes-now.tk"]
    is_flagged = any(bad in url for bad in phishing_list)
    
    return {
        "google_safe_browsing": "Malicious" if is_flagged else "Safe",
        "virus_total_score": 5 if is_flagged else 0, # 0/70 detections
        "phish_tank": "Flagged" if is_flagged else "Clean"
    }

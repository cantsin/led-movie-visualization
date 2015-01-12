# pylint: disable=C0103,C0111

from unicodedata import normalize
from datetime import datetime
from flask import request, url_for

import urllib.parse
import hashlib
import humanize
import re

_punct_re = re.compile(r'[\t !"#$%&\'()*\-/<=>?@\[\\\]^_`{|},.]+')

def slugify(text, delim=b'-'):
    """Generates an ASCII-only slug."""
    result = []
    for word in _punct_re.split(text.lower()):
        word = normalize('NFKD', word).encode('ascii', 'ignore')
        if word:
            result.append(word)
    return delim.join(result).decode("utf-8", "strict")

def naturaltime(ue):
    if isinstance(ue, int):
        return humanize.naturaltime(datetime.fromtimestamp(ue))
    return humanize.naturaltime(ue)

def get_gravatar(email):
    size = 69
    base_url = 'http://www.gravatar.com/avatar/'
    url = base_url + hashlib.md5(email.lower().encode('utf8')).hexdigest() + "?"
    url += urllib.parse.urlencode({'d': 'identicon', 's': str(size)})
    return url

def is_safe_url(target):
    ref_url = urllib.parse.urlparse(request.host_url)
    parsed_url = urllib.parse.urljoin(request.host_url, target)
    test_url = urllib.parse.urlparse(parsed_url)
    return test_url.scheme in ('http', 'https') and \
           ref_url.netloc == test_url.netloc

def url_for_redirect_back(endpoint, **values):
    target = request.form['next']
    if not target or not is_safe_url(target):
        target = url_for(endpoint, **values)
    return target

def get_redirect_target():
    for target in request.values.get('next'), request.referrer:
        if not target:
            continue
        if is_safe_url(target):
            return target

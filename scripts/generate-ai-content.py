#!/usr/bin/env python3
"""Export public HTML to Markdown, using only Python's standard library.

Run after editing site content. --check is a read-only freshness gate for CI.
External articles are linked, never silently fetched or represented as local text.
"""
import argparse
import re
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin

ROOT = Path(__file__).resolve().parents[1]
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}
SKIP = {'head', 'header', 'nav', 'script', 'style', 'svg', 'button', 'noscript'}


@dataclass
class Node:
    tag: str
    attrs: dict = field(default_factory=dict)
    children: list = field(default_factory=list)


class Document(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.root = Node('document')
        self.stack = [self.root]
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        node = Node(tag, dict(attrs))
        self.stack[-1].children.append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def find(node, tag):
    if isinstance(node, str):
        return None
    if node.tag == tag:
        return node
    return next((found for child in node.children if (found := find(child, tag))), None)


def plain(node):
    return node if isinstance(node, str) else ''.join(plain(c) for c in node.children)


def render(node, page_url):
    if isinstance(node, str):
        return re.sub(r'\s+', ' ', node)
    attrs, tag = node.attrs, node.tag
    classes = set(attrs.get('class', '').split())
    if tag in SKIP or 'hidden' in attrs or attrs.get('aria-hidden') == 'true':
        return ''
    if classes & {'currently-footer', 'currently-sr-only', 'currently-controls', 'section-doodle'}:
        return ''
    text = ''.join(render(c, page_url) for c in node.children).strip()
    if tag == 'img':
        alt = attrs.get('alt', '').strip()
        return f"![{alt}]({urljoin(page_url, attrs['src'])})" if alt and attrs.get('src') else ''
    if tag == 'a':
        href = attrs.get('href')
        return f'[{text}]({urljoin(page_url, href)})' if href and text else text
    if not text:
        return '\n' if tag == 'br' else ''
    if tag in {'h1', 'h2', 'h3', 'h4', 'h5', 'h6'}:
        return '\n\n' + '#' * (min(int(tag[1]) + 1, 6)) + ' ' + text + '\n\n'
    if tag == 'blockquote':
        quote = '> ' + text.replace('\n', '\n> ')
        source = f"\n\nSource: {urljoin(page_url, attrs['cite'])}" if attrs.get('cite') else ''
        return '\n\n' + quote + source + '\n\n'
    if tag in {'em', 'i'}:
        return '*' + text + '*'
    if tag in {'strong', 'b'}:
        return '**' + text + '**'
    if tag == 'li':
        return '\n- ' + text + '\n'
    if tag in {'p', 'div', 'section', 'article', 'figure', 'figcaption', 'ul', 'ol', 'main'}:
        return '\n\n' + text + '\n\n'
    return text


def generate():
    origin = 'https://' + (ROOT / 'CNAME').read_text().strip() + '/'
    pages = []
    for path in ROOT.rglob('*.html'):
        relative = path.relative_to(ROOT)
        if any(part.startswith('.') for part in relative.parts) or relative.as_posix() == 'index.html':
            continue
        pages.append(path)
    order = {'home.html': 0, 'about.html': 1, 'projects/index.html': 2, 'writings/index.html': 3, 'readings.html': 4}
    pages.sort(key=lambda p: (order.get(p.relative_to(ROOT).as_posix(), 5), p.as_posix()))
    outputs, entries, sections = {}, [], []
    for path in pages:
        relative = path.relative_to(ROOT)
        page_url = urljoin(origin, relative.as_posix())
        doc = Document(path.read_text()).root
        title_node = find(doc, 'title')
        title = plain(title_node).strip() if title_node else relative.stem
        body = find(doc, 'body')
        if not body:
            raise ValueError(f'{relative} has no body')
        text = re.sub(r'\n[ \t]+', '\n', render(body, page_url))
        text = re.sub(r'\n{3,}', '\n\n', text).strip()
        text = '\n'.join(line.rstrip() for line in text.splitlines())
        markdown = f'# {title}\n\nSource: {page_url}\n\n{text}\n'
        output = relative.with_suffix('.md')
        outputs[output.as_posix()] = markdown
        entries.append(f'- [{title}]({urljoin(origin, output.as_posix())})')
        sections.append(markdown)
    intro = (
        '# Luna Liu\n\n'
        '> Text edition of Luna Liu’s public website.\n\n'
        f'Website: {origin}\n\n'
        f'Human homepage: {urljoin(origin, "home.html")}\n\n'
        'Generated from the website’s HTML. Original wording and source links are preserved; '
        'dates and reading statuses are as stated on the pages. '
        'External articles, including the Notion developer diary, are linked rather than reproduced.\n\n'
    )
    outputs['llms.txt'] = intro + '## Full text\n\n' + f'- [Entire website]({origin}llms-full.txt): All local content pages in one Markdown document.\n\n' + '## Pages\n\n' + '\n'.join(entries) + '\n'
    outputs['llms-full.txt'] = intro + '## Contents\n\n' + '\n'.join(entries) + '\n\n---\n\n' + '\n---\n\n'.join(sections)
    return outputs


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Fail if generated files need updating; do not write.')
    args = parser.parse_args()
    outputs = generate()
    stale = []
    for name, content in outputs.items():
        path = ROOT / name
        if args.check:
            if not path.exists() or path.read_text() != content:
                stale.append(name)
        else:
            path.write_text(content)
    if stale:
        raise SystemExit('AI content needs refreshing. Run python3 scripts/generate-ai-content.py\n' + '\n'.join(stale))
    print(f'{"Checked" if args.check else "Generated"} {len(outputs)} Markdown files.')

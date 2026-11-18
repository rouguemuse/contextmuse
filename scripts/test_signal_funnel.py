import os
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import expect, sync_playwright

ROOT = Path(__file__).resolve().parents[1]


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def check_funnel(browser, base_url, width, height):
    page = browser.new_page(viewport={"width": width, "height": height})
    requests = []

    def submit(route):
        requests.append(route.request.post_data_json)
        if len(requests) == 1:
            route.fulfill(status=503, json={"error": "Please try again."})
        else:
            route.fulfill(json={"ok": True, "submission_id": "test_signal_snapshot", "synthetic": True})

    page.route("**/api/lead/", submit)
    page.goto(f"{base_url}/signal/?utm_source=facebook&utm_medium=paid_social&utm_campaign=signal_snapshot")
    expect(page.get_by_role("heading", level=1)).to_have_text("Where is your restaurant losing margin?")
    image = page.get_by_alt_text("Signal diagnostic priority interface")
    expect(image).to_be_visible()
    assert image.evaluate("(img) => img.complete && img.naturalWidth > 0")
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
    if os.getenv("SIGNAL_SCREENSHOTS"):
        page.screenshot(animations="disabled", path=f"/tmp/signal-landing-{width}.png")

    page.get_by_role("link", name="Request a $195 Snapshot").click()
    expect(page.locator("#tab-2")).to_have_attribute("aria-selected", "true")
    expect(page.get_by_text("Signal Snapshot ($195)", exact=True)).to_be_visible()
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
    if os.getenv("SIGNAL_SCREENSHOTS"):
        page.screenshot(animations="disabled", path=f"/tmp/signal-intake-{width}.png")

    form = page.locator("#signal-b2-form")
    assert form.bounding_box()["y"] < page.locator(".branch-picker").bounding_box()["y"]
    form.get_by_label("Name", exact=True).fill("Test Restaurant Owner")
    form.get_by_label("Email Address", exact=True).fill("owner@example.com")
    form.get_by_label("POS or Software You Currently Use").fill("Toast")
    problem = form.get_by_label("What problem are you noticing?")
    problem.fill("Comps spike during weekend dinner.")
    button = page.get_by_role("button", name="Request Snapshot")
    button.click()
    expect(page.get_by_role("alert")).to_have_text("Please try again.")
    expect(problem).to_have_value("Comps spike during weekend dinner.")
    button.click()
    expect(page.locator("#b2-sub-id")).to_have_text("test_signal_snapshot")
    assert len(requests) == 2
    for payload in requests:
        assert payload["selected_tier"] == "snapshot"
        assert payload["inquiry_type"] == "signal"
        assert payload["operating_system"] == "Toast"
        assert payload["utm_source"] == "facebook"
        assert payload["utm_medium"] == "paid_social"
        assert payload["utm_campaign"] == "signal_snapshot"
        assert "uploaded_files" not in payload

    page.goto(f"{base_url}/signal/intake/")
    expect(page.locator("#tab-1")).to_have_attribute("aria-selected", "true")
    page.close()


if __name__ == "__main__":
    handler = partial(QuietHandler, directory=str(ROOT))
    with ThreadingHTTPServer(("127.0.0.1", 0), handler) as server, sync_playwright() as playwright:
        Thread(target=server.serve_forever, daemon=True).start()
        browser = playwright.chromium.launch(executable_path=os.getenv("CHROMIUM_PATH"))
        for width, height in [(390, 844), (1440, 1000)]:
            check_funnel(browser, f"http://127.0.0.1:{server.server_port}", width, height)
            print(f"Signal funnel passed at {width}px")
        browser.close()
        server.shutdown()

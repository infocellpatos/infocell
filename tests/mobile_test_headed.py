from playwright.sync_api import sync_playwright
import time

URL = 'http://127.0.0.1:8000'

def run():
    with sync_playwright() as p:
        device = p.devices.get('iPhone 13') or p.devices.get('iPhone 12')
        # launch headed browser so user can watch
        browser = p.chromium.launch(headless=False, slow_mo=100)
        context = browser.new_context(**(device or {}), record_video_dir='tests/artifacts')
        page = context.new_page()

        print('Navigating to', URL)
        page.goto(URL, wait_until='networkidle')

        # Open mobile menu via JS click
        page.wait_for_selector('#nav-toggle', timeout=5000)
        page.evaluate("() => document.getElementById('nav-toggle').click()")
        page.wait_for_timeout(800)

        # Pause so you can see the opened menu
        print('Menu opened — observing for 1.5s')
        time.sleep(1.5)

        # Press Escape to close menu
        page.keyboard.press('Escape')
        page.wait_for_timeout(400)

        # Fill and submit form
        page.fill('#fullName', 'Teste Headed')
        page.fill('#email', 'headed@example.com')
        page.fill('#phone', '83999999999')
        try:
            page.select_option('#deviceType', label='Celular')
        except Exception:
            page.select_option('#deviceType', index=0)
        page.fill('#problemDescription', 'Teste automatizado (headed).')

        # Submit using JS to avoid pointer issues
        page.evaluate('() => document.querySelector("button[type=\'submit\']").click()')

        # Wait a moment to see the modal
        print('Form submitted — waiting for modal (2s)')
        time.sleep(2)

        # Keep the browser open for a bit so you can watch (10s)
        print('Keeping browser open for 8s so you can watch the flow...')
        time.sleep(8)

        # Close context and browser
        context.close()
        browser.close()

if __name__ == '__main__':
    run()

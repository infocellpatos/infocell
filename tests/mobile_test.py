from playwright.sync_api import sync_playwright

URL = 'http://127.0.0.1:8000'

def run():
    with sync_playwright() as p:
        device = p.devices.get('iPhone 13') or p.devices.get('iPhone 12')
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(**(device or {}))
        page = context.new_page()

        print('Navigating to', URL)
        page.goto(URL, wait_until='networkidle')

        # Wait for the nav toggle and click it (use JS click to avoid pointer interception)
        page.wait_for_selector('#nav-toggle', timeout=5000)
        page.evaluate("() => document.getElementById('nav-toggle').click()")
        page.wait_for_timeout(300)  # small pause for UI

        # Check focus: evaluate if the first link inside mobile-nav is the activeElement
        first = page.query_selector('#mobile-nav a')
        if first is None:
            print('ERROR: first link in mobile nav not found')
        else:
            focused = page.evaluate('(el) => document.activeElement === el', first)
            print('first_link_focused:', focused)

        # Press Escape to close menu
        page.keyboard.press('Escape')
        page.wait_for_timeout(200)
        is_hidden = page.evaluate("() => document.getElementById('mobile-nav').classList.contains('hidden')")
        print('mobile_nav_hidden_after_Esc:', is_hidden)

        # Fill and submit form
        page.fill('#fullName', 'Teste Mobile')
        page.fill('#email', 'test@example.com')
        page.fill('#phone', '83999999999')
        # select by label
        try:
            page.select_option('#deviceType', label='Celular')
        except Exception:
            # fallback: select first option
            page.select_option('#deviceType', index=0)
        page.fill('#problemDescription', 'Teste automatizado do formulário.')

        # Submit (force click to avoid pointer interception in headless)
        page.click('button[type="submit"]', force=True)

        # Wait for the modal to be visible
        try:
            page.wait_for_selector('#email-modal', state='visible', timeout=5000)
            print('modal_visible: True')
        except Exception:
            print('modal_visible: False')

        # Press Escape to close modal
        page.keyboard.press('Escape')
        page.wait_for_timeout(200)
        modal_hidden = page.evaluate("() => document.getElementById('email-modal').style.display === 'none'")
        print('modal_hidden_after_Esc:', modal_hidden)

        browser.close()

if __name__ == '__main__':
    run()

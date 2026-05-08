import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';

const scriptContent = fs.readFileSync('./script.js', 'utf8');

function createMockElement(className = '') {
    const classList = new Set();
    if (className) {
        className.split(' ').forEach(c => { if(c) classList.add(c); });
    }
    return {
        classList: {
            add: (cls) => classList.add(cls),
            remove: (cls) => classList.delete(cls),
            contains: (cls) => classList.has(cls),
            toggle: (cls) => {
                if (classList.has(cls)) {
                    classList.delete(cls);
                    return false;
                } else {
                    classList.add(cls);
                    return true;
                }
            }
        },
        get className() { return Array.from(classList).join(' '); },
        getAttribute: () => '',
        setAttribute: () => {},
        addEventListener: () => {},
        style: {},
        value: '',
        appendChild: () => {},
        textContent: '',
        remove: () => {},
    };
}

test('Hero Slider showSlide logic', async (t) => {
    const slides = [createMockElement(), createMockElement(), createMockElement()];
    const dots = [createMockElement(), createMockElement(), createMockElement()];

    const domHandlers = {};

    const mockDocument = {
        getElementById: (id) => {
            if (id === 'contactForm') return null; // Simplify for slider test
            return createMockElement();
        },
        querySelector: (selector) => {
            return createMockElement();
        },
        querySelectorAll: (selector) => {
            if (selector === '.slider-image') return slides;
            if (selector === '.dot') return dots;
            return [];
        },
        addEventListener: (event, handler) => {
            domHandlers[event] = handler;
        },
        body: createMockElement(),
        createElement: () => createMockElement(),
    };

    const mockWindow = {
        addEventListener: () => {},
        document: mockDocument,
        setInterval: () => 123, // mock timer id
        clearInterval: () => {},
        setTimeout: (fn, ms) => setTimeout(fn, ms),
        AOS: { init: () => {} },
        fetch: () => Promise.resolve({ json: () => Promise.resolve({ success: true }) }),
        FormData: function() {},
    };

    const context = vm.createContext({
        document: mockDocument,
        window: mockWindow,
        console: console,
        setInterval: mockWindow.setInterval,
        clearInterval: mockWindow.clearInterval,
        setTimeout: mockWindow.setTimeout,
        AOS: mockWindow.AOS,
        fetch: mockWindow.fetch,
        FormData: mockWindow.FormData,
        // In script.js, some things are accessed without window.
        navigator: { userAgent: 'node' },
    });

    // Run the script in context
    vm.runInContext(scriptContent, context);

    // Trigger DOMContentLoaded
    if (domHandlers['DOMContentLoaded']) {
        domHandlers['DOMContentLoaded']();
    }

    const changeSlide = mockWindow.changeSlide;
    const currentSlide = mockWindow.currentSlide;

    assert.ok(changeSlide, 'changeSlide should be defined on window');
    assert.ok(currentSlide, 'currentSlide should be defined on window');

    await t.test('Initial state: first slide is active', () => {
        assert.strictEqual(slides[0].classList.contains('active'), true);
        assert.strictEqual(dots[0].classList.contains('active'), true);
        assert.strictEqual(slides[1].classList.contains('active'), false);
    });

    await t.test('Next slide', () => {
        changeSlide(1);
        assert.strictEqual(slides[1].classList.contains('active'), true);
        assert.strictEqual(slides[0].classList.contains('active'), false);
    });

    await t.test('Wrap around to first slide from last', () => {
        currentSlide(3); // index 2
        assert.strictEqual(slides[2].classList.contains('active'), true);
        changeSlide(1); // wraps to 0
        assert.strictEqual(slides[0].classList.contains('active'), true);
        assert.strictEqual(slides[2].classList.contains('active'), false);
    });

    await t.test('Wrap around to last slide from first', () => {
        currentSlide(1); // index 0
        assert.strictEqual(slides[0].classList.contains('active'), true);
        changeSlide(-1); // wraps to 2
        assert.strictEqual(slides[2].classList.contains('active'), true);
        assert.strictEqual(slides[0].classList.contains('active'), false);
    });

    await t.test('Jump to specific slide using currentSlide', () => {
        currentSlide(2); // index 1
        assert.strictEqual(slides[1].classList.contains('active'), true);
        assert.strictEqual(slides[0].classList.contains('active'), false);
        assert.strictEqual(slides[2].classList.contains('active'), false);
    });
});

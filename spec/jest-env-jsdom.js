const JSDOMEnvironment = require('jest-environment-jsdom').default;
const LocationImpl = require('jsdom/lib/jsdom/living/window/Location-impl.js').implementation;
const { serializeURL } = require('whatwg-url');

// Custom Jest environment that patches jsdom's navigation to use the public
// reconfigure() API instead of directly writing private internal fields.
// This is needed because jsdom 26 does not update document._URL when
// window.location.href is assigned — it calls notImplemented() and no-ops.
class CustomJSDOMEnvironment extends JSDOMEnvironment {
  async setup() {
    await super.setup();
    const { dom } = this;

    LocationImpl.prototype._locationObjectNavigate = function (url) {
      dom.reconfigure({ url: serializeURL(url) });
    };
  }
}

module.exports = CustomJSDOMEnvironment;

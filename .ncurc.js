// Config for npm-check-updates (ncu).
// Packages listed here are excluded from `ncu -u` upgrade suggestions.
module.exports = {
  reject: [
    // jvectormap (unmaintained, ~2017) was written against jQuery 3 and calls
    // APIs removed in jQuery 4: $.isArray, $.isFunction, $.proxy, $.type, etc.
    // Pinned until jvectormap is replaced.
    'jquery',
    '@types/jquery'
  ]
};

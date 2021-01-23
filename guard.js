"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.guard = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var guard = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (req, res, next) {
    var token = req.headers.authorization && req.headers.authorization.split("")[1];

    try {
      if (!token) {
        return res.json({
          success: false,
          data: "Token not found!"
        });
      }

      var decrypt = yield _jsonwebtoken.default.verify(token, secret);
      req.userId = decrypt.userID;
      return next();
    } catch (error) {
      res.json({
        success: false,
        data: error
      });
    }

    console.log(token);
    next();
  });

  return function guard(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.guard = guard;
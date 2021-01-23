"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _User = _interopRequireDefault(require("../models/User"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _checkMissingFields = _interopRequireDefault(require("../helpers/checkMissingFields"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

require("dotenv").config();

var jwtSecret = process.env.JWT_SECRET;

var verifyToken = token => _jsonwebtoken.default.verify(token, jwtSecret);

var handleLogin = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (data) {
    var {
      phone,
      password
    } = data;

    if (!phone) {
      throw "Missing phone number";
    }

    if (!password) {
      throw "Missing password";
    }

    var user = yield _User.default.findOne({
      phone
    });

    if (!user) {
      throw "Phone is not found";
    }

    var isPasswordMatch = _bcryptjs.default.compareSync(password, user.password);

    if (!isPasswordMatch) {
      throw "Password is not correct";
    }

    return _jsonwebtoken.default.sign({
      userId: String(user._id)
    }, jwtSecret);
  });

  return function handleLogin(_x) {
    return _ref.apply(this, arguments);
  };
}();

var register = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* (data) {
    var {
      phone,
      password
    } = data;

    if (!phone) {
      throw "missing phone number";
    }

    if (!password) {
      throw "missing password";
    }

    var hashedPassword = _bcryptjs.default.hashSync(password);

    return _User.default.create({
      phone,
      password: hashedPassword
    });
  });

  return function register(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var forgotPassword = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(function* (data) {
    var {
      phone,
      newPassword
    } = data;

    var hashedPassword = _bcryptjs.default.hashSync(newPassword);

    var user = yield _User.default.findOne({
      phone
    });

    if (user) {
      yield _User.default.findOneAndUpdate({
        phone
      }, {
        $set: {
          password: hashedPassword
        }
      }, {
        new: true
      });
    } else {
      throw "User not found.";
    }
  });

  return function forgotPassword(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var changePassword = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(function* (data) {
    var {
      oldPassword,
      newPassword,
      phone
    } = data;

    var hashedNewPassword = _bcryptjs.default.hashSync(newPassword);

    var user = yield _User.default.findOne({
      phone
    });
    var password = user.password;
    var requiredData = {
      oldPassword,
      newPassword,
      phone
    };

    if (!user) {
      throw "user not found!";
    } else {
      (0, _checkMissingFields.default)(requiredData);
    }

    if (!_bcryptjs.default.compareSync(oldPassword, password)) {
      throw "old password wrong";
    }

    return _User.default.findOneAndUpdate({
      phone
    }, {
      $set: {
        password: hashedNewPassword
      }
    }, {
      new: true
    });
  });

  return function changePassword(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

var AuthController = {
  handleLogin,
  register,
  verifyToken,
  forgotPassword,
  changePassword
};
var _default = AuthController;
exports.default = _default;
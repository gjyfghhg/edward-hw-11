"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _User = _interopRequireDefault(require("../models/User"));

var _paginate = _interopRequireDefault(require("../helpers/paginate"));

var _checkMissingFields = _interopRequireDefault(require("../helpers/checkMissingFields"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var fetchUsers = () => {
  return _User.default.find();
};

var changeAvatar = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (data, url) {
    var {
      phone
    } = data;
    var user = yield _User.default.findOne({
      phone
    });

    if (user) {
      yield _User.default.findOneAndUpdate({
        phone
      }, {
        $set: {
          avatar: url
        }
      }, {
        new: true
      });
    }
  });

  return function changeAvatar(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var createNewUser = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* (req) {
    var {
      email,
      phone,
      password,
      username,
      avatar,
      gender
    } = req.body;
    var requiredData = {
      email,
      password,
      phone,
      username,
      avatar,
      gender
    };
    (0, _checkMissingFields.default)(requiredData);
    var duplicatedUsername = yield _User.default.findOne({
      username
    });
    var duplicatedEmail = yield _User.default.findOne({
      email
    });
    var duplicatedPhone = yield _User.default.findOne({
      phone
    });

    if (duplicatedUsername || duplicatedPhone || duplicatedEmail) {
      throw "User already exists with this email or phone or username";
    }

    var hashedPassword = _bcryptjs.default.hashSync(password);

    var newUser = {
      email,
      password: hashedPassword,
      phone,
      username,
      avatar,
      gender,
      friends: []
    };
    return _User.default.create(newUser);
  });

  return function createNewUser(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

var getAllUsers = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(function* () {
    return _User.default.find();
  });

  return function getAllUsers() {
    return _ref3.apply(this, arguments);
  };
}();

var getUserById = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(function* (id) {
    return _User.default.findById(id).select("email phone username password");
  });

  return function getUserById(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

var getUserByUsername = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(function* (username) {
    return _User.default.findOne({
      username
    });
  });

  return function getUserByUsername(_x5) {
    return _ref5.apply(this, arguments);
  };
}();

var getUserByEmail = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(function* (email) {
    return _User.default.findOne({
      email
    });
  });

  return function getUserByEmail(_x6) {
    return _ref6.apply(this, arguments);
  };
}();

var updateUserById = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(function* (id, key, value) {
    return _User.default.findByIdAndUpdate(id, {
      [key]: value
    }, {
      new: true
    });
  });

  return function updateUserById(_x7, _x8, _x9) {
    return _ref7.apply(this, arguments);
  };
}();

var deleteUserById = id => {
  return _User.default.findByIdAndRemove(id);
};

var addFriendship = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(function* (friend_1_id, friend_2_id) {
    if (friend_1_id && friend_2_id) {
      // check if user #2 is already a friend of user #1
      var _friend_ = yield _User.default.findById(friend_1_id);

      if (_friend_.friends.includes(friend_2_id)) {
        throw "They are already friends!";
      } else {
        // Find friend 1's data, and put friend_2 id into friend 1's friend list
        yield _User.default.findByIdAndUpdate(friend_1_id, {
          $push: {
            friends: friend_2_id
          }
        }); // Find friend 2's data, and put friend_1 id into friend 2's friend list

        yield _User.default.findByIdAndUpdate(friend_2_id, {
          $push: {
            friends: friend_1_id
          }
        });
      }
    } else {
      throw "You need to send both friends IDs";
    }
  });

  return function addFriendship(_x10, _x11) {
    return _ref8.apply(this, arguments);
  };
}();

var checkFriendship = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(function* (friend_1_id, friend_2_id) {
    if (friend_1_id && friend_2_id) {
      if (friend_1.friends.includes(friend_2_id)) {
        throw "true!";
      } else {
        throw "false";
      }
    }
  });

  return function checkFriendship(_x12, _x13) {
    return _ref9.apply(this, arguments);
  };
}();

var UserController = {
  fetchUsers,
  changeAvatar,
  createNewUser,
  getAllUsers,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  addFriendship,
  updateUserById,
  deleteUserById,
  checkFriendship
};
var _default = UserController;
exports.default = _default;
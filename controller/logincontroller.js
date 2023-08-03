const crypto = require("node:crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const {login} = require("../db/queries/querieslogin.js");
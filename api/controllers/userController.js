import { 
  fetchAllUsers,
  fetchUserById,
  insertUser,
  isUserValid,
  fetchDetailsByEmail,
  logoutByToken
} from "../models/userModel.js";
import { assignToken } from "../models/tokenModel.js";

const UNKNOWN_ERROR = {
  message: "Unknown error",
  errorCode: 9999
};

export async function getAllUsers(req, res) {
  let result = UNKNOWN_ERROR;
  try {
    const users = await fetchAllUsers();
    result = {
      message: "Success",
      errorCode: 0,
      users: users
    };
  } catch (error) {
    console.error("DB error", error);
    result.message = `Database error ${error}`;
    result.errorCode = 1001;
    res.status(500);
  }
  res.formatView(result);
}

export async function getUserById(req, res) {
  let result = UNKNOWN_ERROR;
  const { id } = req.params;

  try {
    const user = await fetchUserById(id);

    result = {
      message: "Success",
      errorCode: 0,
      user: user
    };
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500);
    result.message = `Error retrieving user with id ${id}`;
    result.errorCode = 1002;
  }

  res.formatView(result);
}

export async function registerUser(req, res) {
  console.log("---in userController subscribeUser---");

  let result = UNKNOWN_ERROR;
  const newUser = req.body;
  console.log(newUser);

  try {
    const createdUser = await insertUser(newUser);
    console.log('after model', createdUser);
    result = {
      message: "Success",
      errorCode: 0,
      user: createdUser
    };
  } catch (error) {
    console.error("Error inserting user:", error);

    res.status(500);
    result.message = `Error inserting user`;
    result.errorCode = 1002;
  }
  res.formatView(result);
}

export async function loginUser(req, res) {
  console.log("---in userController login---");
  console.log("body: ", req.body);
  let result = UNKNOWN_ERROR;
  const { email: userEmail, passHash: userPassHash } = req.body;

  try {
    const checkUser = await isUserValid(userEmail, userPassHash);
    if (checkUser) {
        const loggedUser = await fetchDetailsByEmail(userEmail);
        const userToken = await assignToken(loggedUser.id);
        result = {
          message: "Successfull login",
          errorCode: 0,
          // user: loggedUser,
          token: userToken
        };
    } else {
      // we only want to catch and throw errors from the backend here hence an user invalid auth is not handled here
      // tho we return result that will the frontend it failed
      result = {
          message: "Invalid credentials",
          errorCode: 401,
        };
        res.status(401);
      }
  } catch (error) {
    catchMsg('user login from backend', 'backend', error, 1069, res, 500, result);
  }

  console.log("result: ", result);
  res.formatView(result);
}

export async function logoutUser(req, res) {
  console.log('--- in logout ctrl---');
  let result = UNKNOWN_ERROR;

  try {
    const logoutConfirmation = await logoutByToken(req.selectedToken);
    console.log(logoutConfirmation);
    if (logoutConfirmation) {
      result = {
        message: "Success",
        errorCode: 0
    };
    } else {
        result = {
          message: "Failed",
          errorCode: 1,
        }
    }

  } catch (error) {
    console.error("DB error", error);
    result.message = `Database error ${error}`;
    result.errorCode = 1001;
    res.status(500);
  }
  res.formatView(result);
}

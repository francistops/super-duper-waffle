import {
    debugFetchAllTasks,
    fetchAllTasksByProject,
    fetchAllTasksByUser,
    fetchNextTasks,
    insertTaskByProject
} from '../models/taskModel.js';

import { catchMsg, cl } from '../lib/utils.js';

const UNKNOWN_ERROR = {
        message: "Unknown error",
        errorCode: 9999
};

export async function debugGetAllTasks(req, res) {
    let result = UNKNOWN_ERROR;
    
    try {
        const Tasks = await debugFetchAllTasks();
        result = {
            message: 'Success',
            errorCode: 0,
            rows: Tasks
        };
    } catch (error) {
        catchMsg('Tasks', 'Database', error, 1001, res, 500, result);
        res.status(500);
    }

    res.formatView(result);
};

export async function getAllTasksByProject(req, res) {
    let result = UNKNOWN_ERROR;
    
    try {
        const Tasks = await fetchAllTasksByProject();
        result = {
            message: 'Success',
            errorCode: 0,
            rows: Tasks
        };
    } catch (error) {
        catchMsg('Tasks', 'Database', error, 1001, 500);
    }

    res.formatView(result);
};

export async function getAllTasksByUser(req, res) {
    let result = UNKNOWN_ERROR;
    
    try {
        const Tasks = await fetchAllTasksByUser();
        result = {
            message: 'Success',
            errorCode: 0,
            rows: Tasks
        };
    } catch (error) {
        catchMsg('Tasks', 'Database', error, 1001, 500);
    }

    res.formatView(result);
};

export async function getNextTasks(req, res) {
    let result = UNKNOWN_ERROR;
    const { ids, nbRequested } = req.body;
    cl('TaskController', 'getNextPosts', [ids, nbRequested]);
    try {
        const posts = await fetchNextTasks(ids, nbRequested);
        result = {
            message: 'Success',
            errorCode: 0,
            posts: posts
        }
    } catch (error) {
        catchMsg('Tasks', 'Database', error, 1021, 500);
    }

    res.formatView(result);
};

export async function createTask(req, res) {
    let result = UNKNOWN_ERROR;
    const data = req.body;
    console.log(data);

    try {
        const createdPost = await insertTaskByProject(data);

        result = {
            message: 'Success',
            errorCode: 0,
            post: createdPost
        }
    } catch (error) {
        catchMsg('Tasks', 'Database', error, 1002, 500);
    }

    res.formatView(result);
};


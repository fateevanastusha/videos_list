"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = 432;
//parser
const parserMiddleware = (0, body_parser_1.default)({});
app.use(parserMiddleware);
const videosDataBase = [
    {
        id: 1,
        title: "Star Wars: Episode III",
        author: "George Lucas",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2015-05-15T00:00:00.000Z",
        publicationDate: "2015-05-15T08:00:00.000Z",
        availableResolutions: ["P144"],
    },
    {
        id: 2,
        title: "Star Wars: Episode III",
        author: "George Lucas",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2015-05-15T00:00:00.000Z",
        publicationDate: "2015-05-15T08:00:00.000Z",
        availableResolutions: ["P144"],
    }
];
const availableResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];
//delete all videos
app.delete('/testing/all-data', (req, res) => {
    videosDataBase.splice(0, videosDataBase.length);
    res.send(204);
});
//return all videos
app.get('/videos', (req, res) => {
    res.send(videosDataBase);
});
//return video by id
app.get('/videos/:id', (req, res) => {
    let video = videosDataBase.find(p => p.id === +req.params.id);
    if (video) {
        res.send(video);
    }
    else {
        res.send(404);
    }
});
//delete video by id
app.delete('/videos/:id', (req, res) => {
    for (let i = 0; i < videosDataBase.length; i++) {
        if (videosDataBase[i].id === +req.params.id) {
            videosDataBase.splice(i, 1);
            res.send(204);
            return;
        }
    }
    res.send(404);
});
//create new video
app.post('/videos', (req, res) => {
    let newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: req.body.canBeDownloaded,
        minAgeRestriction: req.body.minAgeRestriction,
        createdAt: (new Date().toISOString()),
        publicationDate: (new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()),
        availableResolutions: req.body.availableResolutions
    };
    let errors_array = [];
    //start checking
    //title
    if (typeof (newVideo === null || newVideo === void 0 ? void 0 : newVideo.title) !== "string" || newVideo.title.length > 40) {
        errors_array.push({ message: "error", field: "title" });
    }
    //author
    if (typeof (newVideo === null || newVideo === void 0 ? void 0 : newVideo.author) !== "string" || newVideo.author.length > 20) {
        errors_array.push({ message: "error", field: "author" });
    }
    //availableResolutions
    if (Array.isArray(newVideo === null || newVideo === void 0 ? void 0 : newVideo.availableResolutions)) {
        const length = newVideo === null || newVideo === void 0 ? void 0 : newVideo.availableResolutions.length;
        let checking = newVideo === null || newVideo === void 0 ? void 0 : newVideo.availableResolutions.filter(value => {
            return availableResolutions.includes(value);
        });
        if (checking.length < length) {
            errors_array.push({ message: "error", field: "availableResolutions" });
        }
    }
    else {
        errors_array.push({ message: "error", field: "availableResolutions" });
    }
    //canBeDownloaded
    if (typeof (newVideo === null || newVideo === void 0 ? void 0 : newVideo.canBeDownloaded) !== "boolean") {
        if ((newVideo === null || newVideo === void 0 ? void 0 : newVideo.canBeDownloaded) === undefined) {
            newVideo.canBeDownloaded = false;
        }
        else {
            errors_array.push({ message: "error", field: "canBeDownloaded" });
        }
    }
    //minAgeRestriction
    if ((newVideo === null || newVideo === void 0 ? void 0 : newVideo.minAgeRestriction) !== null && typeof (newVideo === null || newVideo === void 0 ? void 0 : newVideo.minAgeRestriction) !== "number") {
        if ((newVideo === null || newVideo === void 0 ? void 0 : newVideo.minAgeRestriction) === undefined) {
            newVideo.minAgeRestriction = null;
        }
        else {
            errors_array.push({ message: "error", field: "minAgeRestriction" });
        }
    }
    else if (typeof (newVideo === null || newVideo === void 0 ? void 0 : newVideo.minAgeRestriction) === "number") {
        if (+(newVideo === null || newVideo === void 0 ? void 0 : newVideo.minAgeRestriction) < 1 || +(newVideo === null || newVideo === void 0 ? void 0 : newVideo.minAgeRestriction) > 18) {
            errors_array.push({ message: "error", field: "minAgeRestriction" });
        }
    }
    //endpoint
    if (errors_array.length > 0) {
        res.status(400).send(errors_array);
    }
    else {
        videosDataBase.push(newVideo);
        res.status(201).send(newVideo);
    }
});
//update video
app.put('/videos/:id', (req, res) => {
    let newVideo = videosDataBase.find(p => p.id === +req.params.id);
    let index = videosDataBase.findIndex(p => p.id === +req.params.id);
    let errors_array = [];
    //add by value
    if (newVideo) {
        newVideo = Object.assign(Object.assign({}, newVideo), req.body);
        //check for correct data
        //title
        if (typeof (newVideo === null || newVideo === void 0 ? void 0 : newVideo.title) !== "string" || newVideo.title.length > 40) {
            errors_array.push({ message: "error", field: "title" });
        }
        //author
        if (typeof (newVideo === null || newVideo === void 0 ? void 0 : newVideo.author) !== "string" || newVideo.author.length > 20) {
            errors_array.push({ message: "error", field: "author" });
        }
        //availableResolutions
        if (Array.isArray(newVideo === null || newVideo === void 0 ? void 0 : newVideo.availableResolutions)) {
            const length = newVideo === null || newVideo === void 0 ? void 0 : newVideo.availableResolutions.length;
            let checking = newVideo === null || newVideo === void 0 ? void 0 : newVideo.availableResolutions.filter(value => {
                return availableResolutions.includes(value);
            });
            if (checking.length < length) {
                errors_array.push({ message: "error", field: "availableResolutions" });
            }
        }
        else {
            errors_array.push({ message: "error", field: "availableResolutions" });
        }
        //canBeDownloaded
        if (typeof (newVideo === null || newVideo === void 0 ? void 0 : newVideo.canBeDownloaded) !== "boolean") {
            errors_array.push({ message: "error", field: "canBeDownloaded" });
        }
        //minAgeRestriction
        if ((newVideo === null || newVideo === void 0 ? void 0 : newVideo.minAgeRestriction) !== null && typeof (newVideo === null || newVideo === void 0 ? void 0 : newVideo.minAgeRestriction) !== "number") {
            errors_array.push({ message: "error", field: "minAgeRestriction" });
        }
        else if (typeof (newVideo === null || newVideo === void 0 ? void 0 : newVideo.minAgeRestriction) === "number") {
            if (+(newVideo === null || newVideo === void 0 ? void 0 : newVideo.minAgeRestriction) < 1 || +(newVideo === null || newVideo === void 0 ? void 0 : newVideo.minAgeRestriction) > 18) {
                errors_array.push({ message: "error", field: "minAgeRestriction" });
            }
        }
        //publicationDate
        if (typeof (newVideo === null || newVideo === void 0 ? void 0 : newVideo.publicationDate) === "string") {
            let r = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
            if (!r.test(newVideo.publicationDate)) {
                errors_array.push({ message: "error", field: "publicationDate" });
            }
        }
        else {
            errors_array.push({ message: "error", field: "publicationDate" });
        }
        //assigment to variable
        if (errors_array.length > 0) {
            res.status(400).send(errors_array);
        }
        else {
            videosDataBase[index] = newVideo;
            res.send(204);
        }
    }
    else {
        res.send(404);
    }
    ;
});
//start app
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

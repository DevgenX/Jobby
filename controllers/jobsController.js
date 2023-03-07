import Job from "../models/Job.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";
import mongoose from "mongoose";
import moment from "moment";

const createJob = async (req, res) => {
  const { position, company } = req.body;

  if (!position || !company) {
    throw new BadRequestError("Please provide required field");
  }

  req.body.createdBy = req.user.userId;

  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId });

  res
    .status(StatusCodes.OK)
    .json({ jobs, totalJobs: jobs.length, numOfPages: 1 });
};

const updateJob = async (req, res) => {
  const { id: jobId } = req.params;

  const { company, position, jobLocation } = req.body;

  if (!position || !company) {
    throw new BadRequestError("Please provide required field");
  }

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  checkPermissions(req.user, job.createdBy);

  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ updatedJob });
  // job.position = position;
  // job.company = company;
  // job.jobLocation = jobLocation;
  // await job.save();
};

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;

  const result = await Job.deleteOne({ _id: jobId });

  if (result.deletedCount === 0) {
    throw new NotFoundError(`No job with id: ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ msg: "Deleted Job" });
};

const showStats = async (req, res) => {
  // aggregates all the data that is owned by the user or creator of the data
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    // Acts like a filter group the data by their status
    // sum = totals the overall data based on status
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, curr) => {
    // assign the id to be title
    const { _id: title, count } = curr;
    // let the value of the acc[title] have the count
    //
    acc[title] = count;
    // return the object
    // { declined: 25, interview: 26, pending: 24}
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;

      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");

      return { date, count };
    })
    .reverse();

  // match converts the data into object that the user has, userId is from the middleware
  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats };

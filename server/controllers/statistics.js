import catchasync from "../utils/catchasync.js";
import Tree from "../models/tree.js";
import Report from "../models/reports.js";
import {
  nextMonth,
  nextYear,
  tomorrow,
  currentMonth,
  currentYear,
  today,
} from "../utils/renderDates.js";

export const getStatistics = catchasync(async (req, res, next) => {
  const paths = await Tree.aggregate([
    {
      $project: {
        path: 1,
        reports_count: { $size: "$reports" },
      },
    },
  ]);
  const currentYearFilter = {
    $gt: currentYear(),
    $lt: nextYear(),
  };

  const todayFilter = {
    $gt: today(),
    $lt: tomorrow(),
  };

  const currentMonthFilter = {
    $gt: currentMonth(),
    $lt: nextMonth(),
  };

  const reportsPerMonth = await Report.aggregate([
    { $match: { createdAt: currentYearFilter } },
    {
      $project: { month: { $month: "$createdAt" }, _id: 1, number: 1 },
    },
    {
      $group: {
        _id: "$month",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalReportsCount = await Report.count({ autoId: { $gt: 0 } });
  console.log(totalReportsCount);
  const todayReportsCount = await Report.count({
    createdAt: todayFilter,
  });

  const currentMonthReportsCount = await Report.count({
    createdAt: currentMonthFilter,
  });

  const currentYearReportsCount = await Report.count({
    createdAt: currentYearFilter,
  });

  res.json({
    paths,
    totalReportsCount,
    todayReportsCount,
    currentYearReportsCount,
    currentMonthReportsCount,
    reportsPerMonth,
  });
});
